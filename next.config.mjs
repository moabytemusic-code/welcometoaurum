const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  /* config options here */
  turbopack: {
    root: __dirname,
  },
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: '/syllabus',
        destination: '/thank-you-syllabus',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/chat/:path*',
        destination: isDev
          ? 'http://localhost:3001/chat/:path*'
          : 'https://aurum-chatbot.vercel.app/chat/:path*',
      },
    ];
  },
};

export default nextConfig;
