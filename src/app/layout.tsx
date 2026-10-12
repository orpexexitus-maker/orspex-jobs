import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    "Free job board connecting job seekers with employers. Browse openings, apply in seconds, and track every application. No fees, no games, just real work.",

  keywords: [
    "jobs",
    "job board",
    "find a job",
    "hire talent",
    "UAE jobs",
    "Dubai jobs",
    "Abu Dhabi jobs",
    "remote jobs",
    "full time jobs",
    "part time jobs",
    "careers",
    "employment",
    "job search",
    "free job board",
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

  // ⚠️ Replace the value below with the code from Google Search Console
  verification: {
    google: "REPLACE_WITH_YOUR_GOOGLE_VERIFICATION_CODE",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Orspex Jobs",
    title: "Orspex Jobs — Find work. Hire talent.",
    description:
      "Free job board connecting job seekers with employers. Browse openings, apply in seconds, and track every application.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Orspex Jobs — Free job board",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Orspex Jobs — Find work. Hire talent.",
    description:
      "Free job board connecting job seekers with employers.",
    images: ["/og-image.png"],
  },

  alternates: {
    canonical: baseUrl,
  },

  category: "business",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
