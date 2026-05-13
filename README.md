# PixelLift AI

PixelLift AI is a Next.js app for browser-based AI image enhancement plus an MDX blog for tutorials and comparisons.

## Requirements

- Node.js 18+
- Supabase project

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with your Supabase credentials.

## Run locally

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

## Notes

- `/dashboard` is protected by middleware.
- Browser-side enhancement runs first and the legacy `/api/enhance` route now returns a graceful deprecation response.
- Blog posts live in `content/blog`.
- AdSense placeholders only render in production on blog pages.
