import Image from "next/image";
import Link from "next/link";
import type { BlogPostMeta } from "@/types";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPostMeta;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_24px_72px_rgba(15,23,42,0.08)]">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-4 p-5">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          {post.category}
        </span>
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 sm:text-xl">{post.title}</h3>
          <p className="line-clamp-3 text-sm leading-6 text-slate-600">{post.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-4 text-sm text-slate-500">
          <span>{post.readingTime}</span>
          <span>{formatDate(post.date)}</span>
        </div>
        <Link href={`/blog/${post.slug}`} className="inline-flex text-sm font-medium text-blue-600 transition hover:text-blue-700">
          Read More {"->"}
        </Link>
      </div>
    </article>
  );
}
