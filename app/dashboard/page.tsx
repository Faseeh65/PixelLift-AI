import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { UsageCounter } from "@/components/tool/UsageCounter";
import { LogoutButton } from "@/components/ui/LogoutButton";
import { formatDate } from "@/lib/utils";
import { getUsageSummary } from "@/lib/usage";
import type { Enhancement } from "@/types";

export const dynamic = "force-dynamic";

interface HistoryResponse {
  data: Array<Pick<Enhancement, "id" | "originalUrl" | "enhancedUrl" | "enhancementMode" | "createdAt">>;
}

export default async function DashboardPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/");
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/");
  }

  const admin = createAdminClient();
  const identifier = data.user.id;

  const [profileResult, historyResult, usage] = await Promise.all([
    admin
      .from("profiles")
      .select("email, created_at")
      .eq("id", data.user.id)
      .maybeSingle<{ email: string; created_at: string }>(),
    admin
      .from("enhancements")
      .select("id, original_url, enhanced_url, enhancement_mode, created_at")
      .eq("user_id", data.user.id)
      .order("created_at", { ascending: false })
      .limit(10),
    getUsageSummary(identifier, "user"),
  ]);

  if (profileResult.error) {
    console.error("[dashboard] profile error:", profileResult.error);
  }

  if (historyResult.error) {
    console.error("[dashboard] history error:", historyResult.error);
  }

  const email = data.user.email ?? "";
  const createdAt = data.user.created_at;
  const profileEmail = profileResult.data?.email ?? null;
  const profileCreatedAt = profileResult.data?.created_at ?? null;
  const history: HistoryResponse = {
    data:
      historyResult.data?.map((row) => ({
        id: row.id,
        originalUrl: row.original_url,
        enhancedUrl: row.enhanced_url,
        enhancementMode: row.enhancement_mode,
        createdAt: row.created_at,
      })) ?? [],
  };

  return (
    <DashboardContent
      email={email}
      createdAt={createdAt}
      history={history}
      profileEmail={profileEmail}
      profileCreatedAt={profileCreatedAt}
      usage={usage}
    />
  );
}

function DashboardContent({
  email,
  createdAt,
  history,
  profileEmail,
  profileCreatedAt,
  usage,
}: {
  email: string;
  createdAt: string;
  history: HistoryResponse;
  profileEmail: string | null;
  profileCreatedAt: string | null;
  usage: { used: number; limit: number; remaining: number; isAuthenticated: boolean };
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Welcome back, {email}</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">Track your daily usage and review enhancement history.</p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-10 grid gap-6">
        <UsageCounter
          used={usage.used}
          limit={usage.limit}
          remaining={usage.remaining}
          isAuthenticated={usage.isAuthenticated}
        />

        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Recent Enhancements</h2>

          <div className="mt-6 space-y-4 md:hidden">
            {history.data.length ? (
              history.data.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <Image src={item.enhancedUrl} alt="Enhanced preview" fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">{formatDate(item.createdAt)}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.enhancementMode}</p>
                      <a
                        href={item.enhancedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex text-sm font-medium text-blue-600"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-500">No enhancements yet.</p>
            )}
          </div>

          <div className="mt-6 hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-3 pr-4 font-medium">Date</th>
                  <th className="py-3 pr-4 font-medium">Thumbnail</th>
                  <th className="py-3 pr-4 font-medium">Mode</th>
                  <th className="py-3 pr-4 font-medium">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {history.data.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 pr-4 text-slate-900">{formatDate(item.createdAt)}</td>
                    <td className="py-4 pr-4">
                      <div className="relative h-16 w-28 overflow-hidden rounded-xl border border-slate-200">
                        <Image src={item.enhancedUrl} alt="Enhanced preview" fill className="object-cover" />
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{item.enhancementMode}</td>
                    <td className="py-4 pr-4">
                      <a
                        href={item.enhancedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Account Info</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>Email: {profileEmail ?? email}</p>
              <p>Join date: {formatDate(profileCreatedAt ?? createdAt)}</p>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Quick Actions</h2>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/blog" className="text-blue-600 hover:text-blue-700">
                Read the blog
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
