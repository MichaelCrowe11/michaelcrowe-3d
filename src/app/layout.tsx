import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "michaelcrowe.ai | Agentic AI Platform",
  description: "Transform expertise into immersive, voice-first experiences. Deep Consulting, Drug Discovery, AI Strategy, and beyond. Private, powerful, and always available.",
  keywords: ["AI Platform", "Voice AI", "Local AI", "Crowe Logic", "AI Consulting", "Drug Discovery", "Machine Learning", "Private AI"],
  authors: [{ name: "Michael Crowe" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CroweAI",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "michaelcrowe.ai | Agentic AI Platform",
    description: "Transform expertise into immersive, voice-first experiences.",
    url: "https://michaelcrowe.ai",
    siteName: "Crowe Logic Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "michaelcrowe.ai | Agentic AI Platform",
    description: "Transform expertise into immersive, voice-first experiences.",
  },
};

import { LiquidCursor } from '@/components/ui/LiquidCursor';
import { PWARegistration } from '@/components/PWARegistration';

const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en" className={`dark ${manrope.variable} ${cormorant.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="font-sans antialiased selection:bg-cyan-500/30 cursor-none">
        <LiquidCursor />
        {children}
        <PWARegistration />
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
          colorPrimary: "#5bc9d6",
          colorBackground: "#060607",
        },
      }}
    >
      {content}
    </ClerkProvider>
  );
}
