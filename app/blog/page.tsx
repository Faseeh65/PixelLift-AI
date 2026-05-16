import type { Metadata } from "next";
import { AdSlot } from "@/components/blog/AdSlot";
import { BlogCard } from "@/components/blog/BlogCard";
import { getAllPosts } from "@/lib/blog";

export const revalidate = 3600;

interface BlogPageProps {
  searchParams?: Promise<{ page?: string }>;
}

export const metadata: Metadata = {
  title: "PixelLift AI Blog - AI Image Enhancement Tips & Tutorials",
  description:
    "Read practical guides about AI image enhancement, photo upscaling, blurry photo repair, image formats, and visual content optimization.",
  openGraph: {
    title: "PixelLift AI Blog - AI Image Enhancement Tips & Tutorials",
    description:
      "Read practical guides about AI image enhancement, photo upscaling, blurry photo repair, image formats, and visual content optimization.",
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
    <section className="bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <header className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">PixelLift AI Blog</p>
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            AI Image Enhancement Blog
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
            Practical guides on upscaling, repairing blurry photos, choosing file formats, and improving images for
            web, social, and ecommerce use.
          </p>
        </header>

        <div className="mt-8">
          <AdSlot slot="blog-header" format="leaderboard" />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Page {page} of {totalPages} | {total} posts total
          </p>
          <div className="flex gap-3 sm:justify-end">
            {page > 1 ? (
              <a className="text-cyan-300 hover:text-cyan-200" href={`/blog?page=${page - 1}`}>
                Previous
              </a>
            ) : null}
            {page < totalPages ? (
              <a className="text-cyan-300 hover:text-cyan-200" href={`/blog?page=${page + 1}`}>
                Next
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
