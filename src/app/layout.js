import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "AURUM | The AI Finance Breakdown",
  description: "Join 18,000+ partners leveraging the world’s first AI-driven Neobanking ecosystem designed to squeeze maximum yield from global markets.",
  keywords: ["AURUM", "AI Finance", "Neobanking", "Yield", "Passive Income"],
};

import GoogleTranslate from "@/components/GoogleTranslate";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-[#050505] text-white">
        <GoogleTranslate />
        {children}
      </body>
    </html>
  );
}
