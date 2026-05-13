import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      return response;
    }

    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Preserve Supabase auth cookies across the request/response boundary.
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const { data } = await supabase.auth.getUser();

    // Dashboard access is protected at the edge so unauthenticated users bounce early.
    if (request.nextUrl.pathname.startsWith("/dashboard") && !data.user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return response;
  } catch (error) {
    console.error("[middleware] error:", error);
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
