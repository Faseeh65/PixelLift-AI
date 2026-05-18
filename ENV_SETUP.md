# Environment Setup

This project uses local environment files for development and Vercel environment variables for production.

## 1. `.env.example`

`.env.example` is safe to commit.

It should contain placeholders only:

- no real API keys
- no private secrets
- no production-only credentials

Use it as the template for new developers and for documenting required variables.

## 2. `.env.local`

`.env.local` is for your own machine only.

Do not commit it to GitHub.

Example local values:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
PICSART_API_KEY=your_real_picsart_api_key
NEXT_PUBLIC_SUPABASE_URL=your_real_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_real_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_real_service_role_key
NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND=local
NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER=Faseeh65
NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME=PixelLift-AI
NEXT_PUBLIC_KEYSTATIC_GITHUB_BRANCH=main
KEYSTATIC_GITHUB_CLIENT_ID=
KEYSTATIC_GITHUB_CLIENT_SECRET=
KEYSTATIC_SECRET=
```

Notes:

- Use `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND=local` for normal development.
- Keep private values on your machine only.
- Never push `.env.local` to GitHub.

## 3. Vercel Environment Variables

Set production values in Vercel, not in GitHub code.

Example production values:

```env
NEXT_PUBLIC_APP_URL=https://your-live-domain.vercel.app
PICSART_API_KEY=your_real_picsart_api_key
NEXT_PUBLIC_SUPABASE_URL=your_real_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_real_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_real_service_role_key
NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND=github
NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER=Faseeh65
NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME=PixelLift-AI
NEXT_PUBLIC_KEYSTATIC_GITHUB_BRANCH=main
KEYSTATIC_GITHUB_CLIENT_ID=your_real_github_oauth_client_id
KEYSTATIC_GITHUB_CLIENT_SECRET=your_real_github_oauth_client_secret
KEYSTATIC_SECRET=your_random_secure_secret
```

Important:

- Production secrets belong in Vercel only.
- Do not place production secrets in GitHub files.
- Redeploy after changing environment variables.

## 4. GitHub OAuth App settings

Create an OAuth App in GitHub:

- Go to `GitHub -> Settings -> Developer settings -> OAuth Apps -> New OAuth App`

Use these values:

- Application name: `PixelLift AI Keystatic`
- Homepage URL: `https://your-live-domain.vercel.app`
- Authorization callback URL: `https://your-live-domain.vercel.app/api/keystatic/github/oauth/callback`

GitHub will generate:

- Client ID
- Client Secret

Put those values into Vercel as:

- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET`

## 5. `KEYSTATIC_SECRET`

`KEYSTATIC_SECRET` should be a strong random string.

Guidance:

- generate a long random secret
- store it in Vercel
- optionally place it in `.env.local` if you are testing GitHub mode locally
- never commit it

## 6. Simple workflow

### Local blog writing

1. Run `npm run dev`.
2. Open `http://localhost:3000/keystatic`.
3. Write or edit a blog post.
4. Save the file.
5. Commit and push the markdown change.
6. Vercel redeploys automatically.

### Live GitHub mode blog writing

1. Add the GitHub OAuth env vars in Vercel.
2. Redeploy the app.
3. Open `https://your-live-domain.vercel.app/keystatic`.
4. Log in with GitHub if prompted.
5. Write or edit a post.
6. Keystatic commits the change to GitHub.
7. Vercel redeploys from the repository update.
