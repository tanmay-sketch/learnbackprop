// next.config.mjs
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx'],
  experimental: {
    mdxRs: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  }
})

export default withMDX(nextConfig)