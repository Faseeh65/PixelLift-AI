export type EnhancementMode = "2x" | "4x" | "denoise";

export interface User {
  id: string;
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Enhancement {
  id: string;
  userId: string | null;
  originalUrl: string;
  enhancedUrl: string;
  enhancementMode: EnhancementMode;
  fileSizeBytes?: number | null;
  status?: "completed" | "failed";
  errorMessage?: string | null;
  createdAt: string;
}

export interface UsageLog {
  id: string;
  identifier: string;
  idType: "user" | "ip";
  usageDate: string;
  count: number;
  updatedAt?: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: string;
  coverImage?: string;
}

export interface BlogPost extends BlogPostMeta {
  body: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  limitReached?: boolean;
  remainingToday?: number;
}
