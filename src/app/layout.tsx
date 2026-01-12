import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "michaelcrowe.ai | Deep Consulting Workflow",
  description: "Voice-first consulting with domain experts. Drug discovery, AI strategy, and beyond. Pay only for what you use.",
  keywords: ["AI Consulting", "Drug Discovery", "Voice AI", "Claude AI", "Machine Learning", "Deep Consulting"],
  authors: [{ name: "Michael Crowe" }],
  openGraph: {
    title: "michaelcrowe.ai | Deep Consulting Workflow",
    description: "Voice-first consulting with domain experts. Pay only for what you use.",
    url: "https://michaelcrowe.ai",
    siteName: "michaelcrowe.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "michaelcrowe.ai | Deep Consulting Workflow",
    description: "Voice-first consulting with domain experts. Pay only for what you use.",
  },
};

import { LiquidCursor } from '@/components/ui/LiquidCursor';

const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased selection:bg-cyan-500/30 cursor-none">
        <LiquidCursor />
        {children}
      </body>
    </html>
  );

  if (!hasClerkKey) {
    return content;
  }

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#22d3ee",
          colorBackground: "#030303",
        },
      }}
    >
      {content}
    </ClerkProvider>
  );
}
