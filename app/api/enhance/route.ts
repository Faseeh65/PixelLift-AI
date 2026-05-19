import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getClientIP } from "@/lib/utils";
import { checkUsageLimit, incrementUsage } from "@/lib/usage";
import { enhanceImageWithPicsart, getPicsartUpscaleFactor } from "@/lib/picsart";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const MAX_FILE_NAME_LENGTH = 180;

function isAllowedImageType(type: string): boolean {
  return ALLOWED_IMAGE_TYPES.has(type.toLowerCase());
}

function buildDataUrl(fileBuffer: Buffer, fileType: string): string {
  return `data:${fileType};base64,${fileBuffer.toString("base64")}`;
}

function hasSafeFileName(name: string): boolean {
  return (
    name.length > 0 &&
    name.length <= MAX_FILE_NAME_LENGTH &&
    !/[<>:"/\\|?*\x00-\x1F]/.test(name)
  );
}

function hasValidImageSignature(fileBuffer: Buffer, fileType: string): boolean {
  if (fileType === "image/jpeg" || fileType === "image/jpg") {
    return fileBuffer[0] === 0xff && fileBuffer[1] === 0xd8 && fileBuffer[2] === 0xff;
  }

  if (fileType === "image/png") {
    return fileBuffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }

  if (fileType === "image/webp") {
    return (
      fileBuffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      fileBuffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  return false;
}

async function maybeStoreEnhancementHistory(params: {
  userId: string;
  originalUrl: string;
  enhancedUrl: string;
  enhancementMode: "2x";
  fileSizeBytes: number;
}) {
  const admin = createAdminClient();
  const { error } = await admin.from("enhancements").insert({
    user_id: params.userId,
    original_url: params.originalUrl,
    enhanced_url: params.enhancedUrl,
    enhancement_mode: params.enhancementMode,
    file_size_bytes: params.fileSizeBytes,
    status: "completed",
  });

  if (error) {
    console.error("[api/enhance] history insert error:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fileValue = formData.get("image") ?? formData.get("file");
    const modeValue = String(formData.get("mode") ?? "2x");

    if (modeValue !== "2x") {
      return NextResponse.json(
        { success: false, error: "That enhancement mode is no longer available." },
        { status: 400 }
      );
    }

    if (!(fileValue instanceof File)) {
      return NextResponse.json({ success: false, error: "Please upload an image first." }, { status: 400 });
    }

    if (!isAllowedImageType(fileValue.type)) {
      return NextResponse.json(
        { success: false, error: "Please upload a JPG, PNG, or WEBP image." },
        { status: 400 }
      );
    }

    if (fileValue.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "Please upload an image smaller than 5MB." },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await fileValue.arrayBuffer());
    if (!hasSafeFileName(fileValue.name)) {
      return NextResponse.json(
        { success: false, error: "Please rename the file and try again." },
        { status: 400 }
      );
    }

    if (!hasValidImageSignature(fileBuffer, fileValue.type.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "The uploaded file does not appear to be a valid image." },
        { status: 400 }
      );
    }

    const scale = getPicsartUpscaleFactor(modeValue);

    const supabase = await createSupabaseServerClient();
    const { data: userResult } = await supabase.auth.getUser();
    const user = userResult.user;
    const isAuthenticated = Boolean(user);
    const identifier = user ? user.id : getClientIP(request);
    const idType = isAuthenticated ? "user" : "ip";

    const usage = await checkUsageLimit(identifier, idType);
    if (!usage.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "You have reached your daily enhancement limit.",
          remainingToday: usage.remaining,
        },
        { status: 429 }
      );
    }

    // Picsart may reject very large-resolution images even if file size is below the app limit.
    const enhancedRemoteUrl = await enhanceImageWithPicsart(fileValue, scale);
    const remainingToday = Math.max(usage.remaining - 1, 0);

    const operations: Array<Promise<unknown>> = [incrementUsage(identifier, idType)];
    if (user) {
      const originalUrl = buildDataUrl(fileBuffer, fileValue.type || "image/png");
      operations.push(
        maybeStoreEnhancementHistory({
          userId: user.id,
          originalUrl,
          enhancedUrl: enhancedRemoteUrl,
          enhancementMode: "2x",
          fileSizeBytes: fileValue.size,
        })
      );
    }

    await Promise.allSettled(operations);

    return NextResponse.json({
      success: true,
      enhancedUrl: enhancedRemoteUrl,
      remainingToday,
    });
  } catch (error) {
    console.error("[api/enhance] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Enhancement failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
