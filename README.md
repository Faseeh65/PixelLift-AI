# PixelLift AI

PixelLift AI is a Next.js app for AI image enhancement plus a Keystatic-backed static blog for tutorials and comparisons.

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
- `PICSART_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## Notes

- `/dashboard` is protected by middleware.
- Enhancement requests are handled by the Picsart-backed `/api/enhance` route.
- Blog posts live in `content/blog` and are managed locally through `/keystatic`.
- Keystatic local mode is intended for local editing, then committing the generated content files to GitHub for Vercel to deploy.
- AdSense placeholders only render in production on blog pages.
