import { cn } from "@/lib/utils";

interface UsageCounterProps {
  used: number;
  limit: number;
  remaining: number;
  isAuthenticated: boolean;
}

export function UsageCounter({ used, limit, remaining, isAuthenticated }: UsageCounterProps) {
  const progress = Math.min((used / limit) * 100, 100);
  const label = isAuthenticated ? "Daily usage" : "Anonymous usage";

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">
            {used} of {limit} free enhancements used today
          </p>
        </div>
        {remaining === 0 ? (
          <p className="text-sm font-medium text-slate-600 sm:text-right">
            You&apos;ve reached today&apos;s free limit. Try again tomorrow.
          </p>
        ) : null}
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] transition-all")}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
