# Environment Setup

This project uses local environment files for development and Vercel environment variables for production.

## `.env.example`

`.env.example` is safe to commit and contains placeholders only:

- no real API keys
- no private secrets
- no production-only credentials

## `.env.local`

`.env.local` is for your own machine only. Do not commit it to GitHub.

Example local values:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
PICSART_API_KEY=your_real_picsart_api_key
NEXT_PUBLIC_SUPABASE_URL=your_real_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_real_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_real_service_role_key
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=faseeeh.65@gmail.com
CONTACT_FROM_EMAIL=your_verified_sender_email
```

## Vercel Environment Variables

Set production values in Vercel, not in GitHub code.

Example production values:

```env
NEXT_PUBLIC_APP_URL=https://pixelliftai.online
PICSART_API_KEY=your_real_picsart_api_key
NEXT_PUBLIC_SUPABASE_URL=your_real_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_real_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_real_service_role_key
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=faseeeh.65@gmail.com
CONTACT_FROM_EMAIL=your_verified_sender_email
```

## Contact Form Email

Required Vercel env vars:

```env
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=faseeeh.65@gmail.com
CONTACT_FROM_EMAIL=your_verified_sender_email
```

Notes:

- `CONTACT_FROM_EMAIL` must be verified in Resend.
- Do not use `NEXT_PUBLIC_RESEND_API_KEY`.
- Redeploy after adding env vars.

## Keystatic

Keystatic is local-only.

- No Keystatic GitHub OAuth environment variables are needed.
- No Keystatic production editing environment variables are needed.
- Write blog posts locally at `http://localhost:3000/keystatic`.
- Commit markdown files from `content/blog/`.
- Push to GitHub so Vercel redeploys and publishes the blog.

Production `/keystatic` is intentionally disabled. Public `/blog` pages continue to read committed markdown files.
