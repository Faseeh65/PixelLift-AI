import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Browser-based enhancement is now handled in the client. Use the homepage upload tool instead of this legacy API route.",
    },
    { status: 410 }
  );
}
