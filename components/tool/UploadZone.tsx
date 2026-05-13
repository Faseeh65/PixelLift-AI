"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  variant?: "dark" | "light";
}

const maxSizeBytes = 5 * 1024 * 1024;
const acceptedTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export function UploadZone({
  onFileSelected,
  disabled = false,
  variant = "dark",
}: UploadZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptedTypes,
    maxSize: maxSizeBytes,
    multiple: false,
    disabled,
    onDropAccepted(files) {
      const [file] = files;
      if (!file) {
        return;
      }

      setError(null);
      setSelectedFile(file);
      onFileSelected(file);
    },
    onDropRejected(rejections) {
      const [first] = rejections;
      const message =
        first?.errors[0]?.code === "file-too-large"
          ? "File too large. Maximum size is 5MB."
          : "Invalid file type. Please upload JPG, PNG, or WEBP.";
      setError(message);
      setSelectedFile(null);
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fileSize = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    const sizeInKb = selectedFile.size / 1024;
    if (sizeInKb >= 1024) {
      return `${(sizeInKb / 1024).toFixed(1)} MB`;
    }

    return `${sizeInKb.toFixed(0)} KB`;
  }, [selectedFile]);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "w-full cursor-pointer rounded-[2rem] border-2 border-dashed p-5 text-center transition sm:p-8",
          "border-slate-200 bg-slate-50 hover:border-[#3B82F6]/70",
          isDragActive
            ? variant === "light"
              ? "border-[#3B82F6] bg-[#EFF6FF]"
              : "border-[#3B82F6] bg-[#EFF6FF]"
            : "",
          disabled ? "cursor-not-allowed opacity-60" : ""
        )}
        aria-label="Image upload area"
      >
        <input {...getInputProps()} />
        <div className="mx-auto flex max-w-md flex-col items-center gap-3">
          <span
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16",
              "bg-slate-200 text-slate-500"
            )}
          >
            <Upload className="h-7 w-7" />
          </span>
          <div>
            <p
              className={cn(
                "text-base font-semibold sm:text-lg",
                "text-slate-900"
              )}
            >
              {isDragActive ? "Drop your image here" : "Drag & drop your image here"}
            </p>
            <p className={cn("mt-1 text-sm", "text-slate-600")}>
              or click the button below to browse
            </p>
          </div>
          <p className={cn("text-sm", "text-slate-400")}>
            Supports JPG, PNG, and WEBP up to 5MB
          </p>
        </div>
      </div>

      {error ? <p className="text-sm text-[#EF4444]">{error}</p> : null}

      {selectedFile && previewUrl ? (
        <div
          className={cn(
            "flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center"
          )}
        >
          <div
            className={cn(
              "relative h-24 w-full overflow-hidden rounded-xl sm:w-40",
              "bg-slate-100"
            )}
          >
            <Image src={previewUrl} alt={selectedFile.name} fill unoptimized className="object-cover" />
          </div>
          <div className="space-y-1">
            <p className={cn("flex items-center gap-2 font-medium", "text-slate-900")}>
              <FileImage className="h-4 w-4 text-[#3B82F6]" />
              {selectedFile.name}
            </p>
            <p className={cn("text-sm", "text-slate-500")}>{fileSize}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
