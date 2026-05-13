import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = Math.max(Number(url.searchParams.get("page") ?? "1"), 1);
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? "10"), 1), 20);
    const offset = (page - 1) * limit;
    const admin = createAdminClient();

    const { data: rows, error, count } = await admin
      .from("enhancements")
      .select("id, original_url, enhanced_url, enhancement_mode, created_at", {
        count: "exact",
      })
      .eq("user_id", data.user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    const total = count ?? rows?.length ?? 0;

    return NextResponse.json({
      data: (rows ?? []).map((row) => ({
        id: row.id,
        originalUrl: row.original_url,
        enhancedUrl: row.enhanced_url,
        enhancementMode: row.enhancement_mode,
        createdAt: row.created_at,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (error) {
    console.error("[api/history] error:", error);
    return NextResponse.json(
      { error: "Unable to load enhancement history." },
      { status: 500 }
    );
  }
}
