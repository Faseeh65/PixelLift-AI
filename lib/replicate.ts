import Replicate from "replicate";
import type { EnhancementMode } from "@/types";

type PredictionStatus = "starting" | "processing" | "succeeded" | "failed" | "canceled" | "aborted";

function getScale(mode: EnhancementMode): number {
  if (mode === "4x") {
    return 4;
  }

  return 2;
}

function getModelInput(mode: EnhancementMode): Record<string, number> {
  return {
    scale: getScale(mode),
  };
}

function normalizeOutput(output: unknown): string {
  if (typeof output === "string") {
    return output;
  }

  if (Array.isArray(output) && output.length > 0) {
    const [first] = output;
    if (typeof first === "string") {
      return first;
    }

    return String(first);
  }

  if (output && typeof output === "object") {
    const candidate = output as { url?: () => URL; toString?: () => string };
    if (typeof candidate.url === "function") {
      return candidate.url().toString();
    }
    if (typeof candidate.toString === "function") {
      return candidate.toString();
    }
  }

  throw new Error("Replicate returned an unexpected output format.");
}

export async function enhanceImage(
  imageBase64: string,
  mode: EnhancementMode,
  mimeType: string = "image/jpeg"
): Promise<string> {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      throw new Error("Missing REPLICATE_API_TOKEN.");
    }

    const replicate = new Replicate({ auth: token });
    const imageDataUri = `data:${mimeType};base64,${imageBase64}`;
    const prediction = (await replicate.predictions.create({
      model: "nightmareai/real-esrgan",
      input: {
        image: imageDataUri,
        ...getModelInput(mode),
      },
    })) as {
      id: string;
      status: PredictionStatus;
      output?: unknown;
      error?: unknown;
    };

    const deadline = Date.now() + 25000;
    let currentPrediction = prediction;

    while (Date.now() < deadline) {
      if (currentPrediction.status === "succeeded") {
        return normalizeOutput(currentPrediction.output);
      }

      if (currentPrediction.status === "failed" || currentPrediction.status === "canceled" || currentPrediction.status === "aborted") {
        throw new Error("Replicate prediction failed.");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      currentPrediction = (await replicate.predictions.get(currentPrediction.id)) as typeof currentPrediction;
    }

    throw new Error("Replicate prediction timed out.");
  } catch (error) {
    console.error("[replicate] enhanceImage error:", error);
    throw new Error("Enhancement failed. Please try again.");
  }
}
