"use client";

import { ReactCompareSlider, ReactCompareSliderHandle, ReactCompareSliderImage } from "react-compare-slider";

interface ComparisonSliderProps {
  originalUrl: string;
  enhancedUrl: string;
}

export function ComparisonSlider({ originalUrl, enhancedUrl }: ComparisonSliderProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-4">
      <div className="mb-3 flex items-center justify-between px-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
        <span>Original</span>
        <span>Enhanced</span>
      </div>
      <div className="aspect-[4/3] overflow-hidden rounded-[1.5rem] sm:aspect-[16/10]">
        <ReactCompareSlider
          className="h-full w-full"
          itemOne={<ReactCompareSliderImage src={originalUrl} alt="Original image" />}
          itemTwo={<ReactCompareSliderImage src={enhancedUrl} alt="Enhanced image" />}
          handle={<ReactCompareSliderHandle buttonStyle={{ color: "#3B82F6" }} linesStyle={{ color: "#3B82F6" }} />}
          defaultPosition={50}
        />
      </div>
    </div>
  );
}
