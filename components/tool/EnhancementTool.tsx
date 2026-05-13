"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import type { EnhancementMode } from "@/types";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "@/components/ui/Toast";
import { UploadZone } from "@/components/tool/UploadZone";
import { ModeSelector } from "@/components/tool/ModeSelector";
import { ComparisonSlider } from "@/components/tool/ComparisonSlider";
import { BrowserEnhancementError, enhanceImageInBrowser } from "@/lib/browser-enhance";

interface EnhancementToolProps {
  showUsageCounter?: boolean;
  variant?: "dark" | "light";
}

export function EnhancementTool({ showUsageCounter = true, variant = "light" }: EnhancementToolProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState<EnhancementMode>("2x");
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const originalUrl = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (originalUrl) {
        URL.revokeObjectURL(originalUrl);
      }
    };
  }, [originalUrl]);

  useEffect(() => {
    return () => {
      if (enhancedUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(enhancedUrl);
      }
    };
  }, [enhancedUrl]);

  async function handleEnhance() {
    if (!selectedFile) {
      toast.error("Please upload an image first.");
      return;
    }

    try {
      setIsLoading(true);
      setStatusMessage("Preparing browser model...");
      if (enhancedUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(enhancedUrl);
      }

      const result = await enhanceImageInBrowser(selectedFile, mode, setStatusMessage);
      setEnhancedUrl(result.url);
      const modeLabel =
        mode === "denoise" ? "denoised" : mode === "4x" ? "4x enhanced" : "2x enhanced";
      toast.success(`Your image is ready and ${modeLabel}.`);
    } catch (error) {
      console.error("[enhancement-tool] error:", error);
      if (error instanceof BrowserEnhancementError) {
        toast.error(error.message);
      } else {
        toast.error(error instanceof Error ? error.message : "Enhancement failed.");
      }
    } finally {
      setIsLoading(false);
      setStatusMessage(null);
    }
  }

  async function handleDownload() {
    if (!enhancedUrl) {
      return;
    }

    try {
      const anchor = document.createElement("a");
      anchor.href = enhancedUrl;
      anchor.download = `pixellift-enhanced-${Date.now()}.png`;
      anchor.click();
    } catch (error) {
      console.error("[enhancement-tool] download error:", error);
      toast.error("Unable to download the image.");
    }
  }

  function handleReset() {
    setSelectedFile(null);
    if (enhancedUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(enhancedUrl);
    }
    setEnhancedUrl(null);
    setMode("2x");
    setStatusMessage(null);
  }

  return (
    <section className={variant === "light" ? "space-y-6" : "space-y-6"}>
      {showUsageCounter ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
          <p className="text-sm text-slate-500">Enhancement runs locally in your browser.</p>
        </div>
      ) : null}

      <div
        className={
          variant === "light"
            ? "rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6 lg:p-8"
            : "rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6 lg:p-8"
        }
      >
        <div className="space-y-6">
          <UploadZone
            disabled={isLoading}
            variant={variant}
            actionLabel="Insert Image"
            onFileSelected={(file) => {
              setSelectedFile(file);
              setEnhancedUrl(null);
            }}
          />

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-600">
              Enhancement mode
            </p>
            <ModeSelector selected={mode} onChange={setMode} variant={variant} />
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              void handleEnhance();
            }}
            loading={isLoading}
            disabled={!selectedFile}
          >
            Enhance Image
          </Button>

          {isLoading ? (
            <div
              className={
                variant === "light"
                  ? "flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-900"
                  : "flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-900"
              }
            >
              <Spinner size="md" color="#3B82F6" />
              <span>{statusMessage ?? "Enhancing your image..."}</span>
            </div>
          ) : null}

          {enhancedUrl && originalUrl ? (
            <div className="space-y-4">
              <ComparisonSlider originalUrl={originalUrl} enhancedUrl={enhancedUrl} />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => void handleDownload()} className="w-full flex-1">
                  <Download className="h-4 w-4" />
                  Download Enhanced Image
                </Button>
                <Button variant="secondary" className="w-full flex-1" onClick={handleReset}>
                  <RefreshCw className="h-4 w-4" />
                  Enhance Another
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={
                variant === "light"
                  ? "rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500"
                  : "rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500"
              }
            >
              Insert an image to start. The tool will upscale it after you choose a file.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
