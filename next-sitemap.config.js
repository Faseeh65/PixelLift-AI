const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const siteUrl =
  appUrl && !appUrl.includes("localhost")
    ? appUrl
    : "https://pixelliftai.online";

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude: ["/dashboard", "/auth/*", "/api/*"],
};
