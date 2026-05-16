import type { Metadata } from "next";
import { AdSlot } from "@/components/blog/AdSlot";
import { BlogCard } from "@/components/blog/BlogCard";
import { getAllPosts } from "@/lib/blog";

export const revalidate = 3600;

interface BlogPageProps {
  searchParams?: Promise<{ page?: string }>;
}

export const metadata: Metadata = {
  title: "PixelLift AI Blog — AI Image Enhancement Tips",
  description:
    "Read AI image enhancement tips, photo upscaling guides, blurry photo repair tutorials, and image optimization advice.",
  openGraph: {
    title: "PixelLift AI Blog — AI Image Enhancement Tips",
    description:
      "Read AI image enhancement tips, photo upscaling guides, blurry photo repair tutorials, and image optimization advice.",
    type: "website",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = (await Promise.resolve(searchParams ?? {})) as { page?: string };
  const page = Math.max(Number(params.page ?? "1"), 1);
  const perPage = 9;
  const posts = await getAllPosts();
  const total = posts.length;
  const totalPages = Math.max(Math.ceil(total / perPage), 1);
  const visiblePosts = posts.slice((page - 1) * perPage, page * perPage);

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_45%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <header className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">PixelLift AI Blog</p>
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            AI Image Enhancement Blog
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Practical guides on upscaling, repairing blurry photos, choosing file formats, and improving images for
            web, social, and ecommerce use.
          </p>
        </header>

        <div className="mt-8">
          <AdSlot slot="blog-header" format="leaderboard" />
        </div>

        {visiblePosts.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-500 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            No blog posts published yet.
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Page {page} of {totalPages} | {total} posts total
          </p>
          <div className="flex gap-3 sm:justify-end">
            {page > 1 ? (
              <a className="text-blue-600 hover:text-blue-700" href={`/blog?page=${page - 1}`}>
                Previous
              </a>
            ) : null}
            {page < totalPages ? (
              <a className="text-blue-600 hover:text-blue-700" href={`/blog?page=${page + 1}`}>
                Next
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
