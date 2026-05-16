import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { AdSlot } from "@/components/blog/AdSlot";
import { BlogCard } from "@/components/blog/BlogCard";
import { cn, formatDate } from "@/lib/utils";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export const revalidate = 3600;

interface PageParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} - PixelLift AI`,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageParams) {
  const { slug } = await Promise.resolve(params);
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getAllPosts();
  const relatedPosts = allPosts.filter((entry) => entry.category === post.category && entry.slug !== post.slug).slice(0, 3);

  return (
    <article className="bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
              {post.category}
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">{post.description}</p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
            <span>{post.author}</span>
            <span>|</span>
            <span>{formatDate(post.date)}</span>
            <span>|</span>
            <span>{post.readingTime}</span>
          </div>
        </header>

        <div className="mt-8">
          <AdSlot slot="blog-top" format="leaderboard" />
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/80 shadow-[0_24px_80px_rgba(2,6,23,0.35)]">
          {post.coverImage ? (
            <div className="relative aspect-[16/9] border-b border-slate-800">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 896px" />
            </div>
          ) : (
            <div className="flex aspect-[16/9] items-end border-b border-slate-800 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-indigo-500/20 p-6">
              <div className="max-w-xl space-y-3">
                <div className="h-2 w-28 rounded-full bg-white/20" />
                <div className="h-2 w-40 rounded-full bg-white/15" />
                <div className="h-2 w-20 rounded-full bg-white/10" />
              </div>
            </div>
          )}
          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="space-y-6 break-words text-slate-300">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h2 className="text-3xl font-bold tracking-tight text-white">{children}</h2>,
                  h2: ({ children }) => <h3 className="text-2xl font-bold tracking-tight text-white">{children}</h3>,
                  h3: ({ children }) => <h4 className="text-xl font-semibold tracking-tight text-white">{children}</h4>,
                  p: ({ children }) => <p className="leading-8 text-slate-300">{children}</p>,
                  a: ({ children, href }) => (
                    <a href={href} className="break-words text-cyan-300 underline underline-offset-4">
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
                  li: ({ children }) => <li className="leading-7">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-cyan-400 pl-4 italic text-slate-300">
                      {children}
                    </blockquote>
                  ),
                  pre: ({ children }) => (
                    <pre className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm leading-7 text-slate-100">
                      {children}
                    </pre>
                  ),
                  code: ({ children, className }) => (
                    <code
                      className={cn(
                        "rounded bg-slate-800 px-1.5 py-0.5 text-[0.95em] text-slate-100",
                        className
                      )}
                    >
                      {children}
                    </code>
                  ),
                  table: ({ children }) => (
                    <div className="w-full overflow-x-auto">
                      <table className="min-w-full border-collapse text-left text-sm">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border-b border-slate-700 px-3 py-2 font-semibold text-slate-100">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border-b border-slate-800 px-3 py-2 align-top text-slate-300">{children}</td>
                  ),
                  img: ({ alt, src }) => (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      alt={alt ?? ""}
                      src={src ?? ""}
                      loading="lazy"
                      decoding="async"
                      className="h-auto max-w-full rounded-2xl"
                    />
                  ),
                }}
              >
                {post.body}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <AdSlot slot="blog-mid" format="rectangle" />
        </div>

        <section className="mt-12 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.35)] sm:p-6">
          <h2 className="text-2xl font-bold tracking-tight text-white">Related Posts</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <BlogCard key={related.slug} post={related} />
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
