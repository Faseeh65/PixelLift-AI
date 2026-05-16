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
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950 shadow-[0_24px_80px_rgba(2,6,23,0.35)] transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-[0_28px_88px_rgba(2,6,23,0.45)]">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-slate-800 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-indigo-500/20">
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
              <div className="h-2 w-16 rounded-full bg-white/25" />
              <div className="h-2 w-24 rounded-full bg-white/15" />
              <div className="h-2 w-12 rounded-full bg-white/10" />
            </div>
            <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
              PixelLift AI
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
            {post.category}
          </span>
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-white sm:text-xl">{post.title}</h3>
          <p className="line-clamp-3 text-sm leading-6 text-slate-300">{post.description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 text-sm text-slate-400">
          <span>{formatDate(post.date)}</span>
          <span>{post.readingTime}</span>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
        >
          Read More {"->"}
        </Link>
      </div>
    </article>
  );
}
