import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PrepAI — Elite AI Mock Interview & Speech Analytics Studio",
  description: "Next-generation AI mock interview platform for Data Analysts, SQL Specialists, Python Developers, and HR rounds with real-time speech analytics and STAR scoring.",
};

import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-[#FAF8F5] text-[#1A1A1A] overflow-x-hidden selection:bg-[#D6C4A8]/40 selection:text-[#1A1A1A]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
