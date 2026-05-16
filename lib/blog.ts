import "server-only";

import readingTime from "reading-time";
import type { Node as MarkdocNode } from "@markdoc/markdoc";
import type { BlogPost, BlogPostMeta, KeystaticBlogPostEntry } from "@/types";
import { reader } from "@/lib/keystatic-reader";

function extractTextFromNode(node: MarkdocNode): string {
  const parts: string[] = [];

  for (const child of node.walk()) {
    if (child.type !== "text") {
      continue;
    }

    const content = child.attributes.content;
    if (typeof content === "string" && content.trim().length > 0) {
      parts.push(content);
    }
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function toMetaFromEntry(slug: string, entry: KeystaticBlogPostEntry): BlogPostMeta {
  return {
    slug,
    title: entry.title,
    description: entry.description,
    date: entry.date,
    author: entry.author,
    category: entry.category,
    tags: [...entry.tags],
    readingTime: "",
    coverImage: typeof entry.coverImage === "string" && entry.coverImage.trim().length > 0 ? entry.coverImage.trim() : undefined,
  };
}

async function toPostFromEntry(slug: string, entry: KeystaticBlogPostEntry): Promise<BlogPost> {
  const content = await entry.content();
  return {
    ...toMetaFromEntry(slug, entry),
    readingTime: readingTime(extractTextFromNode(content.node)).text,
    content: content.node,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const items = await reader.collections.posts.all();

  const posts = await Promise.all(items.map(({ slug, entry }) => toPostFromEntry(slug, entry as KeystaticBlogPostEntry)));

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getLatestPosts(count: number): Promise<BlogPostMeta[]> {
  const posts = await getAllPosts();
  return posts.slice(0, count).map(toMeta);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const entry = await reader.collections.posts.read(slug);

  if (!entry) {
    return null;
  }

  return toPostFromEntry(slug, entry as KeystaticBlogPostEntry);
}

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
