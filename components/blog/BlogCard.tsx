import Image from "next/image";
import Link from "next/link";
import type { BlogPostMeta } from "@/types";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPostMeta;
}

export function BlogCard({ post }: BlogCardProps) {
  const visibleTags = post.tags.slice(0, 2);

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_72px_rgba(15,23,42,0.1)]">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-end justify-between p-5">
            <div className="max-w-[70%] space-y-2">
              <div className="h-2 w-16 rounded-full bg-slate-200" />
              <div className="h-2 w-24 rounded-full bg-slate-100" />
              <div className="h-2 w-12 rounded-full bg-slate-100" />
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
              PixelLift AI
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {post.category}
          </span>
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">{post.title}</h3>
          <p className="line-clamp-3 text-sm leading-6 text-slate-600">{post.description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 text-sm text-slate-500">
          <span>{formatDate(post.date)}</span>
          <span>{post.readingTime}</span>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          Read More {"->"}
        </Link>
      </div>
    </article>
  );
}
