"use client";

import type { EnhancementMode } from "@/types";
import { cn } from "@/lib/utils";

interface ModeSelectorProps {
  selected: EnhancementMode;
  onChange: (mode: EnhancementMode) => void;
  variant?: "dark" | "light";
}

const modes: Array<{ value: EnhancementMode; label: string }> = [
  { value: "2x", label: "2x Upscale" },
];

export function ModeSelector({ selected, onChange, variant = "dark" }: ModeSelectorProps) {
  return (
    <div className="grid gap-3 sm:flex sm:flex-wrap">
      {modes.map((mode) => (
        <button
          key={mode.value}
          type="button"
          onClick={() => onChange(mode.value)}
          className={cn(
            "min-h-11 w-full rounded-full px-4 py-3 text-sm font-medium transition sm:w-auto sm:py-2",
            selected === mode.value
              ? "bg-slate-950 text-white"
              : variant === "light"
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
