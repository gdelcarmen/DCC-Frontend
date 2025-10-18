/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://delcarmenconsulting.com";

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/api/*", "/cli/*"],
  transform: async (config, path) => {
    let priority = config.priority ?? 0.7;
    if (path === "/") {
      priority = 1.0;
    } else if (path.startsWith("/blog") || path.startsWith("/case-studies")) {
      priority = 0.8;
    } else if (path.startsWith("/contact")) {
      priority = 0.6;
    }

    return {
      loc: path,
      changefreq: config.changefreq ?? "weekly",
      priority,
      lastmod: new Date().toISOString()
    };
  }
};
