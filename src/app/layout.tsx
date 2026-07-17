import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTopButton from "./components/ScrollToTopButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tuwin Nilakshana | Professional Squash Athlete & WSF Level 1 Coach",
  description: "Official portfolio of Tuwin Nilakshana, world-ranked squash player (PSA No. 316) representing Sri Lanka. High performance athlete, WSF coach, and Deshabandu award recipient.",
  keywords: [
    "Tuwin Nilakshana",
    "Tuwin Nilakshana Herath",
    "Squash",
    "Professional Squash Athlete",
    "PSA World Tour",
    "Sri Lanka Squash",
    "WSF Level 1 Coach",
    "Squash Coach Shanghai",
    "Deshabandu Award",
    "Sports Management"
  ],
  authors: [{ name: "Tuwin Nilakshana" }],
  creator: "Tuwin Nilakshana",
  openGraph: {
    title: "Tuwin Nilakshana | Professional Squash Athlete & WSF Level 1 Coach",
    description: "Official portfolio of Tuwin Nilakshana, world-ranked squash player representing Sri Lanka. High performance athlete and certified WSF Coach.",
    url: "https://tuwinherath.com",
    siteName: "Tuwin Nilakshana Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tuwin Nilakshana | Professional Squash Athlete & WSF Level 1 Coach",
    description: "Official portfolio of Tuwin Nilakshana, world-ranked squash player representing Sri Lanka.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
    >
      <body className="bg-[#05060b] text-white min-h-full flex flex-col antialiased">
        {children}
        <ScrollToTopButton />
      </body>
    </html>
  );
}
