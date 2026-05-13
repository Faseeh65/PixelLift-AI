# PixelLift AI

PixelLift AI is a Next.js app for AI image enhancement plus an MDX blog for tutorials and comparisons.

## Requirements

- Node.js 18+
- Supabase project
- Replicate API token

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with your Supabase and Replicate credentials.

## Run locally

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Environment variables

- `REPLICATE_API_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

## Notes

- `/dashboard` is protected by middleware.
- `/api/enhance` enforces daily usage limits.
- Blog posts live in `content/blog`.
- AdSense placeholders only render in production on blog pages.
