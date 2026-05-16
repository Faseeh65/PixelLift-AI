export type PicsartUpscaleFactor = 2 | 4;

interface PicsartResultItem {
  id?: string;
  url?: string;
}

interface PicsartErrorPayload {
  message?: string;
  detail?: string;
}

export interface PicsartUpscaleResponse {
  status?: string;
  data?: PicsartResultItem | PicsartResultItem[];
  error?: PicsartErrorPayload;
  url?: string;
  result?: string;
  output?: string;
}

function normalizeOutputUrl(payload: PicsartUpscaleResponse): string | null {
  if (typeof payload.url === "string" && payload.url) {
    return payload.url;
  }

  if (typeof payload.result === "string" && payload.result) {
    return payload.result;
  }

  if (typeof payload.output === "string" && payload.output) {
    return payload.output;
  }

  const data = payload.data;
  if (Array.isArray(data)) {
    const firstItem = data[0];
    if (firstItem && typeof firstItem.url === "string" && firstItem.url) {
      return firstItem.url;
    }
  } else if (data && typeof data.url === "string" && data.url) {
    return data.url;
  }

  return null;
}

export function getPicsartUpscaleFactor(mode: string): PicsartUpscaleFactor {
  if (mode === "4x") {
    return 4;
  }

  return 2;
}

export async function enhanceImageWithPicsart(
  file: File,
  upscaleFactor: PicsartUpscaleFactor
): Promise<string> {
  const apiKey = process.env.PICSART_API_KEY;
  if (!apiKey) {
    throw new Error("Picsart API key is missing.");
  }

  const formData = new FormData();
  formData.append("image", file, file.name);
  formData.append("upscale_factor", String(upscaleFactor));

  const response = await fetch("https://api.picsart.io/tools/1.0/upscale", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "X-Picsart-API-Key": apiKey,
    },
    body: formData,
  });

  const responseText = await response.text();
  let parsed: PicsartUpscaleResponse | null = null;

  try {
    parsed = JSON.parse(responseText) as PicsartUpscaleResponse;
  } catch {
    parsed = null;
  }

  if (!response.ok) {
    console.error("[picsart] provider error:", {
      status: response.status,
      body: parsed ?? responseText,
    });
    throw new Error("Enhancement failed. Please try again.");
  }

  if (!parsed) {
    console.error("[picsart] invalid provider response:", responseText);
    throw new Error("Enhancement failed. Please try again.");
  }

  const outputUrl = normalizeOutputUrl(parsed);
  if (!outputUrl) {
    console.error("[picsart] missing output url:", parsed);
    throw new Error("Enhancement failed. Please try again.");
  }

  return outputUrl;
}
