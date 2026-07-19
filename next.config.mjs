/** @type {import('next').NextConfig} */
const apiOrigin = process.env.API_ORIGIN || "http://127.0.0.1:4000"

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${apiOrigin}/api/:path*` },
      { source: "/uploads/:path*", destination: `${apiOrigin}/uploads/:path*` },
      { source: "/admin", destination: `${apiOrigin}/admin` },
      { source: "/admin/:path*", destination: `${apiOrigin}/admin/:path*` },
    ]
  },
}

export default nextConfig
