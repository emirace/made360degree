import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/animations/smooth-scroll";
import Noise from "@/components/ui/noise";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "MADE360DEGREES | Innovative Leadership Transformation",
  description:
    "MADE360DEGREES - Developing leaders, professionals, and organizations through structured coaching and leadership engagements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased font-sans bg-black text-white`}
      >
        <SmoothScroll>
          <Noise />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
