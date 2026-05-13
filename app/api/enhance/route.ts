import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkUsageLimit, incrementUsage } from "@/lib/usage";
import { enhanceImage } from "@/lib/replicate";
import { getClientIP } from "@/lib/utils";
import type { EnhancementMode } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 25;

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

function isSuspiciousFileName(name: string): boolean {
  return /\.(exe|bat|cmd|js|sh|php|py|ps1)$/i.test(name);
}

function validateMagicBytes(fileType: string, bytes: Uint8Array): boolean {
  const signature = Array.from(bytes.slice(0, 12));

  if (fileType === "image/jpeg") {
    return signature[0] === 0xff && signature[1] === 0xd8;
  }

  if (fileType === "image/png") {
    return (
      signature[0] === 0x89 &&
      signature[1] === 0x50 &&
      signature[2] === 0x4e &&
      signature[3] === 0x47
    );
  }

  if (fileType === "image/webp") {
    const ascii = String.fromCharCode(...signature);
    return ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP";
  }

  return false;
}

function parseMode(rawMode: FormDataEntryValue | null): EnhancementMode {
  const mode = String(rawMode ?? "2x");
  if (mode === "4x" || mode === "denoise") {
    return mode;
  }
  return "2x";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fileEntry = formData.get("image");
    const mode = parseMode(formData.get("mode"));

    if (!(fileEntry instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Please upload JPG, PNG, or WEBP." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(fileEntry.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Please upload JPG, PNG, or WEBP." },
        { status: 400 }
      );
    }

    if (fileEntry.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    if (isSuspiciousFileName(fileEntry.name)) {
      return NextResponse.json(
        { success: false, error: "Invalid file name. Please upload a clean image file." },
        { status: 400 }
      );
    }

    const arrayBuffer = await fileEntry.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    if (!validateMagicBytes(fileEntry.type, bytes)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Please upload JPG, PNG, or WEBP." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    const isAuthenticated = Boolean(user);
    const identifier = user ? user.id : getClientIP(request);
    const idType = isAuthenticated ? "user" : "ip";

    const usageLimit = await checkUsageLimit(identifier, idType);
    if (!usageLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Daily limit reached. Sign up for more free enhancements.",
          limitReached: true,
        },
        { status: 429 }
      );
    }

    const imageBase64 = Buffer.from(arrayBuffer).toString("base64");
    const enhancedUrl = await enhanceImage(imageBase64, mode, fileEntry.type);
    await incrementUsage(identifier, idType);

    if (isAuthenticated && user) {
      try {
        const admin = createAdminClient();
        await admin.from("enhancements").insert({
          user_id: user.id,
          original_url: `uploaded:${encodeURIComponent(fileEntry.name)}`,
          enhanced_url: enhancedUrl,
          enhancement_mode: mode,
          file_size_bytes: fileEntry.size,
          status: "completed",
          error_message: null,
        });
      } catch (error) {
        console.error("[api/enhance] history insert error:", error);
      }
    }

    return NextResponse.json({
      success: true,
      enhancedUrl,
      remainingToday: Math.max(usageLimit.remaining - 1, 0),
    });
  } catch (error) {
    console.error("[api/enhance] error:", error);
    return NextResponse.json(
      { success: false, error: "Enhancement failed. Please try again." },
      { status: 500 }
    );
  }
}
