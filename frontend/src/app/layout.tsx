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

export const metadata: Metadata = {
  title: "YT Video Discussion bot",
  description:
    "This AI-powered YouTube insights app allows users to track episodes across their favorite YouTube channels and analyze them deeply using advanced NLP tools. Built with a modular and scalable Next.js (React) frontend, the app offers a clean UI with list views for channels and episodes. Users can add channels, triggering backend Python APIs that asynchronously fetch episode metadata and transcripts via YouTube’s API. Each episode has a dedicated detail page with tabs for episode info, full transcript, and AI-generated key questions. The AI extracts critical questions from transcripts and provides detailed commentary for each—identifying whether the claims are accurate, misleading, oversimplified, or factually wrong",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
