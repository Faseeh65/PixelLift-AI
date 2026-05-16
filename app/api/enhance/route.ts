import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getClientIP } from "@/lib/utils";
import { checkUsageLimit, incrementUsage } from "@/lib/usage";
import { enhanceImageWithPicsart, getPicsartUpscaleFactor } from "@/lib/picsart";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

function isAllowedImageType(type: string): boolean {
  return ALLOWED_IMAGE_TYPES.has(type.toLowerCase());
}

function buildDataUrl(fileBuffer: Buffer, fileType: string): string {
  return `data:${fileType};base64,${fileBuffer.toString("base64")}`;
}

async function maybeStoreEnhancementHistory(params: {
  userId: string;
  originalUrl: string;
  enhancedUrl: string;
  enhancementMode: "2x" | "4x" | "denoise";
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

    const scale = getPicsartUpscaleFactor(modeValue);
    const fileBuffer = Buffer.from(await fileValue.arrayBuffer());

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
          enhancementMode: modeValue === "4x" || modeValue === "denoise" ? modeValue : "2x",
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
