import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { BlogPost, BlogPostMeta } from "@/types";

const blogDir = path.join(process.cwd(), "content", "blog");

interface BlogFrontmatter {
  slug?: string;
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  category?: string;
  tags?: string[] | string;
  readingTime?: string;
  coverImage?: string;
}

function toStringArray(value: string[] | string | undefined): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

async function readPostFile(fileName: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(blogDir, fileName);
    const file = await readFile(filePath, "utf8");
    const parsed = matter(file);
    const meta = parsed.data as BlogFrontmatter;
    const slug = typeof meta.slug === "string" && meta.slug.trim().length > 0
      ? meta.slug.trim()
      : fileName.replace(/\.mdx?$/i, "");
    const computedReadingTime =
      typeof meta.readingTime === "string" && meta.readingTime.trim().length > 0
        ? meta.readingTime
        : readingTime(parsed.content).text;
    const coverImage = typeof meta.coverImage === "string" && meta.coverImage.trim().length > 0
      ? meta.coverImage.trim()
      : undefined;

    return {
      slug,
      title: String(meta.title ?? slug),
      description: String(meta.description ?? ""),
      date: String(meta.date ?? new Date().toISOString()),
      author: String(meta.author ?? "PixelLift Team"),
      category: String(meta.category ?? "General"),
      tags: toStringArray(meta.tags),
      readingTime: computedReadingTime,
      coverImage,
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
