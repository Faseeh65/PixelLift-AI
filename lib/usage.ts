import type { UsageLog } from "@/types";
import { createAdminClient } from "@/lib/supabase/admin";

function getLimit(idType: "user" | "ip"): number {
  return idType === "user" ? 10 : 3;
}

export async function getUsageSummary(
  identifier: string,
  idType: "user" | "ip"
): Promise<{ used: number; limit: number; remaining: number; isAuthenticated: boolean }> {
  try {
    const supabase = createAdminClient();
    const limit = getLimit(idType);
    const today = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from("usage_logs")
      .select("count")
      .eq("identifier", identifier)
      .eq("id_type", idType)
      .eq("usage_date", today)
      .maybeSingle<Pick<UsageLog, "count">>();

    if (error) {
      throw error;
    }

    const used = data?.count ?? 0;

    return {
      used,
      limit,
      remaining: Math.max(limit - used, 0),
      isAuthenticated: idType === "user",
    };
  } catch (error) {
    console.error("[usage] getUsageSummary error:", error);
    return {
      used: 0,
      limit: getLimit(idType),
      remaining: 0,
      isAuthenticated: idType === "user",
    };
  }
}

export async function checkUsageLimit(
  identifier: string,
  idType: "user" | "ip"
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const summary = await getUsageSummary(identifier, idType);
    return {
      allowed: summary.used < summary.limit,
      remaining: summary.remaining,
    };
  } catch (error) {
    console.error("[usage] checkUsageLimit error:", error);
    return { allowed: false, remaining: 0 };
  }
}

export async function incrementUsage(
  identifier: string,
  idType: "user" | "ip"
): Promise<void> {
  try {
    const supabase = createAdminClient();
    const today = new Date().toISOString().slice(0, 10);

    const { error } = await supabase.from("usage_logs").upsert(
      {
        identifier,
        id_type: idType,
        usage_date: today,
        count: 1,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "identifier,usage_date" }
    );

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("[usage] incrementUsage error:", error);
    throw new Error("Failed to update usage.");
  }
}
