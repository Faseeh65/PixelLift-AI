import type { Metadata } from "next";
import { BlogCard } from "@/components/blog/BlogCard";
import { AdSlot } from "@/components/blog/AdSlot";
import { getAllPosts } from "@/lib/blog";

export const revalidate = 3600;

interface BlogPageProps {
  searchParams?: Promise<{ page?: string }>;
}

export const metadata: Metadata = {
  title: "Blog - PixelLift AI",
  description: "Read AI tools tutorials, image enhancement tips, and practical guides.",
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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Blog</p>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">AI Tools & Tutorials</h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
          Browse tutorials, product comparisons, and practical advice on getting the most out of modern AI image tools.
        </p>
      </header>

      <div className="mt-8">
        <AdSlot slot="blog-header" format="leaderboard" />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {visiblePosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

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
  );
}
