import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.wanderline.site'),
  title: {
    default: "Wanderline — Stories from every corner of the world",
    template: "%s | Wanderline",
  },
  description: "Travel notes, world events, and the crime and culture stories behind them.",
  openGraph: {
    title: "Wanderline — Stories from every corner of the world",
    description: "Travel notes, world events, and the crime and culture stories behind them.",
    url: 'https://www.wanderline.site',
    siteName: 'Wanderline',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Wanderline — Stories from every corner of the world",
    description: "Travel notes, world events, and the crime and culture stories behind them.",
  },
  alternates: {
    canonical: 'https://www.wanderline.site',
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}<Analytics /><SpeedInsights /></body>
    </html>
  );
}