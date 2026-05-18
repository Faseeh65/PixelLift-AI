interface AdSlotProps {
  slot: string;
  format?: "auto" | "rectangle" | "leaderboard";
}

export function AdSlot({ slot, format = "auto" }: AdSlotProps) {
  if (process.env.NODE_ENV !== "production") {
    return (
      <div className="flex min-h-[100px] w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center text-sm text-slate-500 sm:min-h-[120px]">
        Ad Slot
      </div>
    );
  }

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId) {
    return null;
  }

  return (
    <ins
      className="adsbygoogle block w-full max-w-full overflow-hidden"
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
