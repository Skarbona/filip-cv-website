import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Filip Sokołowski - Technical Project Manager",
  description:
    "Engineering Manager and Front-End Team Lead with 14 years of experience specializing in front-end development. Portfolio and CV.",
  keywords: [
    "Filip Sokołowski",
    "Technical Project Manager",
    "Engineering Manager",
    "Software Engineer",
    "Frontend Developer",
    "React",
    "TypeScript",
    "Next.js",
  ],
  authors: [{ name: "Filip Sokołowski", url: "https://github.com/Skarbona" }],
  openGraph: {
    title: "Filip Sokołowski - Technical Project Manager",
    description: "Engineering Manager and Front-End Team Lead with 14 years of experience",
    type: "website",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
