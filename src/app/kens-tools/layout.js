import { Outfit, Inter } from "next/font/google";
import "../globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ken's Business Tools | The AI Marketing Engine",
  description: "Master the tools to scale your network marketing business and funnel high-value leads to Aurum.",
};

export default function KensToolsLayout({ children }) {
  return (
    <div className={`${outfit.variable} ${inter.variable} antialiased bg-[#050505] text-white min-h-screen font-inter`}>
      {children}
    </div>
  );
}
