const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/syllabus/:path*',
        destination: isDev
          ? 'http://localhost:3002/syllabus/:path*'
          : 'https://aurum-education-portal.vercel.app/syllabus/:path*',
      },
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
