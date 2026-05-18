# Keystatic Setup

PixelLift AI uses Keystatic for blog content in `content/blog/`.

## Local mode

1. Run `npm run dev`.
2. Open `http://localhost:3000/keystatic`.
3. Create or edit a post in the Blog Posts collection.
4. Save the post.
5. Keystatic writes the markdown file into `content/blog/`.
6. Commit and push the changed blog file to GitHub.
7. Vercel redeploys from the updated repository.

## Production mode

Use GitHub-backed Keystatic only when the required environment variables are set.

Set these in Vercel:

- `NEXT_PUBLIC_APP_URL=https://pixelliftai.online`
- `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND=github`
- `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER=Faseeh65`
- `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME=PixelLift-AI`
- `NEXT_PUBLIC_KEYSTATIC_GITHUB_BRANCH=main`
- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET`
- `KEYSTATIC_SECRET`

Also keep the existing app environment variables configured:

- `PICSART_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Production `/keystatic` is intentionally blocked unless the required GitHub/OAuth values are present.
That protects the live site from showing a broken admin UI.
The live domain in `NEXT_PUBLIC_APP_URL` and the GitHub OAuth callback URL must match exactly.
If the site uses `www`, the callback must also use `www`.
For the current live domain, the GitHub OAuth callback URL must be:

```text
https://pixelliftai.online/api/keystatic/github/oauth/callback
```

When production GitHub mode is configured correctly:

1. Open `https://yourdomain.com/keystatic`.
2. Sign in with the Keystatic/GitHub flow if prompted.
3. Save changes from the editor.
4. Keystatic commits updates to the GitHub repository.
5. Vercel redeploys from the repository changes.

## Safety note

Local Keystatic mode is not a safe way to store permanent blog edits on a live Vercel deployment.
Do not rely on the Vercel filesystem for persistent content.
Public `/blog` pages still work from the committed markdown files regardless of admin mode.
