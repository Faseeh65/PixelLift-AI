# Keystatic Setup

PixelLift AI uses Keystatic as a local-only CMS for blog content in `content/blog/`.

## Local Writing Workflow

1. Open the project locally.
2. Run `npm install` if dependencies are not installed.
3. Run `npm run dev`.
4. Open `http://localhost:3000/keystatic`.
5. Create or edit blog posts in the Blog Posts collection.
6. Keystatic saves files into `content/blog/`.
7. Check `http://localhost:3000/blog`.
8. Commit and push the blog changes:

```bash
git add .
git commit -m "Add blog post"
git push origin main
```

9. Vercel redeploys and publishes the blog.

## Production

- `/keystatic` is disabled on the live Vercel site.
- Blog content still appears live because posts are committed to GitHub.
- Do not try to write blogs directly on the live site.
- No Keystatic GitHub OAuth or production editing environment variables are needed.

Public `/blog` pages read committed markdown from `content/blog/` and continue to work without the admin route in production.
