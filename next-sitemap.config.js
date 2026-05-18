/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://pixelliftai.online",
  generateRobotsTxt: true,
  exclude: ["/dashboard", "/auth/*", "/api/*"],
};
