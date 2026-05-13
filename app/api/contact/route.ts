import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getClientIP } from "@/lib/utils";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    const name = payload.name?.trim() ?? "";
    const email = payload.email?.trim() ?? "";
    const subject = payload.subject?.trim() ?? "";
    const message = payload.message?.trim() ?? "";
    const ipAddress = getClientIP(request);

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: "Please fill in all fields." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    if (message.length < 10) {
      return NextResponse.json({ success: false, error: "Your message is too short." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
      ip_address: ipAddress,
      status: "new",
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/contact] error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to send your message right now." },
      { status: 500 }
    );
  }
}
