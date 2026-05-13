import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { BlogPost, BlogPostMeta } from "@/types";

const blogDir = path.join(process.cwd(), "content", "blog");

async function readPostFile(fileName: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(blogDir, fileName);
    const file = await readFile(filePath, "utf8");
    const parsed = matter(file);
    const slug = fileName.replace(/\.mdx?$/i, "");
    const meta = parsed.data as Record<string, string | string[] | undefined>;
    const computedReadingTime =
      typeof meta.readingTime === "string" && meta.readingTime.trim().length > 0
        ? meta.readingTime
        : readingTime(parsed.content).text;

    return {
      slug,
      title: String(meta.title ?? slug),
      description: String(meta.description ?? ""),
      date: String(meta.date ?? new Date().toISOString()),
      author: String(meta.author ?? "PixelLift Team"),
      category: String(meta.category ?? "General"),
      tags: Array.isArray(meta.tags) ? meta.tags.map(String) : undefined,
      readingTime: computedReadingTime,
      coverImage: String(meta.coverImage ?? "/images/blog/getting-started-with-ai-image-upscaling.svg"),
      body: parsed.content,
    };
  } catch (error) {
    console.error("[blog] readPostFile error:", error);
    return null;
  }
}

export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const files = await readdir(blogDir);
    const posts = await Promise.all(files.filter((file) => file.endsWith(".mdx")).map(readPostFile));
    return posts
      .filter((post): post is BlogPost => Boolean(post))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("[blog] getAllPosts error:", error);
    return [];
  }
});

export const getLatestPosts = cache(async (count: number): Promise<BlogPostMeta[]> => {
  const posts = await getAllPosts();
  return posts.slice(0, count).map(toMeta);
});

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) ?? null;
});

function toMeta(post: BlogPost): BlogPostMeta {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    author: post.author,
    category: post.category,
    tags: post.tags,
    readingTime: post.readingTime,
    coverImage: post.coverImage,
  };
}
