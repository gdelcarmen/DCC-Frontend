/** @type {import('next').NextConfig} */
const repo = 'DCC-Frontend';
const isGithubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  output: 'export',
  trailingSlash: true,
  basePath: isGithubPages ? '/' + repo : '',
  assetPrefix: isGithubPages ? '/' + repo + '/' : '',
};

export default nextConfig;
