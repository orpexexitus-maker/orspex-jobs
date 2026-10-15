// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = "https://orspex-jobs-seeking.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Orspex Jobs — Find work. Hire talent.",
    template: "%s | Orspex Jobs",
  },
  description:
    "Visa-sponsored, remote, and relocation jobs from verified employers worldwide. Apply in seconds, track every application. No fees, no games, just real work.",
  keywords: [
    "jobs", "job board", "visa sponsorship jobs", "relocation jobs",
    "remote jobs", "UAE jobs", "Dubai jobs", "Canada jobs", "Germany jobs",
    "UK jobs", "hire talent", "careers", "employment", "job search",
    "Orspex Jobs",
  ],
  authors: [{ name: "Orspex" }],
  creator: "Orspex",
  publisher: "Orspex",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "7hrdmkpelJvnCzvdVucP78Fp_mSRRFqVUJDTbeybD3o",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Orspex Jobs",
    title: "Orspex Jobs — Find work. Hire talent.",
    description:
      "Visa-sponsored, remote, and relocation jobs from verified employers worldwide.",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "Orspex Jobs" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orspex Jobs — Find work. Hire talent.",
    description: "Visa-sponsored, remote, and relocation jobs worldwide.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: baseUrl },
  category: "business",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}