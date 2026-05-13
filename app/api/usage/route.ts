import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { getClientIP } from "@/lib/utils";
import { getUsageSummary } from "@/lib/usage";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    const isAuthenticated = Boolean(user);

    const identifier = user ? user.id : getClientIP(request);
    const idType = isAuthenticated ? "user" : "ip";
    const usage = await getUsageSummary(identifier, idType);

    return NextResponse.json({
      used: usage.used,
      limit: usage.limit,
      remaining: usage.remaining,
      isAuthenticated,
    });
  } catch (error) {
    console.error("[api/usage] error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to load usage." },
      { status: 500 }
    );
  }
}
