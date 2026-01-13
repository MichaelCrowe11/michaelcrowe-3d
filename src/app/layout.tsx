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
  title: "michaelcrowe.ai | Agentic AI Platform",
  description: "Voice-first AI platform with local models. Private, powerful, and always available.",
  keywords: ["AI Platform", "Voice AI", "Local AI", "Ollama", "Machine Learning", "Private AI"],
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
    description: "Voice-first AI platform with local models. Private and powerful.",
    url: "https://michaelcrowe.ai",
    siteName: "michaelcrowe.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "michaelcrowe.ai | Agentic AI Platform",
    description: "Voice-first AI platform with local models.",
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
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="font-sans antialiased selection:bg-amber-500/20 cursor-none md:cursor-none">
        <LiquidCursor />
        {children}
        <ServiceWorkerRegistration />
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
          colorPrimary: "#c9a55c",
          colorBackground: "#0a0a0a",
        },
      }}
    >
      {content}
    </ClerkProvider>
  );
}
