"use client";

import type { EnhancementMode } from "@/types";

type OrtModule = typeof import("onnxruntime-web");
type InferenceSession = Awaited<ReturnType<OrtModule["InferenceSession"]["create"]>>;

const ORT_VERSION = "1.26.0";
const ORT_WASM_PATH = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`;

const MODEL_URLS: Record<EnhancementMode, string> = {
  "2x": "https://huggingface.co/rippertnt/upscale/resolve/main/RealESRGAN_x2_fp16.onnx?download=1",
  "4x": "https://huggingface.co/FuryTMP/RealESR_Gx4_fp16/resolve/main/RealESR_Gx4_fp16.onnx?download=1",
  denoise: "https://huggingface.co/rippertnt/upscale/resolve/main/RealESRGAN_x2_fp16.onnx?download=1",
};

const sessionCache = new Map<string, Promise<InferenceSession>>();

export class BrowserEnhancementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BrowserEnhancementError";
  }
}

function supportsWebGPU(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

function getTargetScale(mode: EnhancementMode): number {
  if (mode === "4x") {
    return 4;
  }

  return 2;
}

async function loadOrtModule(): Promise<OrtModule> {
  const ortModule = supportsWebGPU()
    ? ((await import("onnxruntime-web/webgpu")) as unknown as OrtModule)
    : ((await import("onnxruntime-web")) as unknown as OrtModule);

  ortModule.env.logLevel = "warning";
  ortModule.env.wasm.numThreads = 1;
  ortModule.env.wasm.proxy = false;
  ortModule.env.wasm.wasmPaths = ORT_WASM_PATH;

  if ("webgpu" in ortModule.env && supportsWebGPU()) {
    ortModule.env.webgpu.powerPreference = "high-performance";
  }

  return ortModule;
}

async function getSession(modelUrl: string): Promise<InferenceSession> {
  const cacheKey = modelUrl;
  const cached = sessionCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const pending = (async () => {
    const ort = await loadOrtModule();
    const executionProviders = supportsWebGPU() ? ["webgpu", "wasm"] : ["wasm"];

    try {
      return await ort.InferenceSession.create(modelUrl, {
        executionProviders,
        graphOptimizationLevel: "all",
      });
    } catch (error) {
      if (supportsWebGPU()) {
        // Some browsers advertise WebGPU but fail at runtime; retry with WASM for resilience.
        return await ort.InferenceSession.create(modelUrl, {
          executionProviders: ["wasm"],
          graphOptimizationLevel: "all",
        });
      }

      throw error;
    }
  })();

  const guarded = pending.catch((error) => {
    sessionCache.delete(cacheKey);
    throw error;
  });

  sessionCache.set(cacheKey, guarded);
  return guarded;
}

async function fileToImageData(file: File): Promise<ImageData> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.decoding = "async";
    image.src = objectUrl;
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      throw new BrowserEnhancementError("Your browser could not prepare the image for enhancement.");
    }

    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, canvas.width, canvas.height);
  } catch (error) {
    throw new BrowserEnhancementError(
      error instanceof Error ? error.message : "Your browser could not load the image."
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function imageDataToObjectUrl(imageData: ImageData, mode: EnhancementMode, originalSize: { width: number; height: number }): Promise<string> {
  const canvas = document.createElement("canvas");
  const shouldRestoreOriginalSize = mode === "denoise";
  const outputWidth = shouldRestoreOriginalSize ? originalSize.width : imageData.width;
  const outputHeight = shouldRestoreOriginalSize ? originalSize.height : imageData.height;

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    return Promise.reject(new BrowserEnhancementError("Your browser could not render the enhanced image."));
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  if (shouldRestoreOriginalSize) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    const tempContext = tempCanvas.getContext("2d");
    if (!tempContext) {
      return Promise.reject(new BrowserEnhancementError("Your browser could not finalize the enhanced image."));
    }

    tempContext.putImageData(imageData, 0, 0);
    context.drawImage(tempCanvas, 0, 0, outputWidth, outputHeight);
  } else {
    context.putImageData(imageData, 0, 0);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new BrowserEnhancementError("Your browser could not export the enhanced image."));
        return;
      }

      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
}

export async function enhanceImageInBrowser(
  file: File,
  mode: EnhancementMode,
  onStatus?: (status: string) => void
): Promise<{ url: string; width: number; height: number }> {
  try {
    onStatus?.("Loading image...");
    const imageData = await fileToImageData(file);
    const modelUrl = MODEL_URLS[mode];
    onStatus?.("Loading browser model...");
    const session = await getSession(modelUrl);

    const ort = await loadOrtModule();
    const inputName = session.inputNames[0];
    const outputName = session.outputNames[0];

    if (!inputName || !outputName) {
      throw new BrowserEnhancementError("The browser model is missing an input or output tensor.");
    }

    onStatus?.(`Enhancing ${mode === "denoise" ? "image" : `at ${getTargetScale(mode)}x`}...`);
    const inputTensor = await ort.Tensor.fromImage(imageData, {
      tensorFormat: "RGB",
      tensorLayout: "NCHW",
      dataType: "float32",
    });

    const result = await session.run({ [inputName]: inputTensor });
    const outputTensor = result[outputName];

    if (!outputTensor) {
      throw new BrowserEnhancementError("The browser model did not return an enhanced image.");
    }

    const outputImageData = outputTensor.toImageData({ format: "RGB", tensorLayout: "NCHW" });
    const url = await imageDataToObjectUrl(outputImageData, mode, {
      width: imageData.width,
      height: imageData.height,
    });

    return {
      url,
      width: mode === "denoise" ? imageData.width : outputImageData.width,
      height: mode === "denoise" ? imageData.height : outputImageData.height,
    };
  } catch (error) {
    if (error instanceof BrowserEnhancementError) {
      throw error;
    }

    throw new BrowserEnhancementError(
      error instanceof Error ? error.message : "Your browser could not enhance the image."
    );
  }
}
