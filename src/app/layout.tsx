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
  title: "Crowe Logic Studio | MichaelCrowe.ai",
  description: "Transform expertise into immersive, voice-first experiences. Deep Consulting, Drug Discovery, AI Strategy, and beyond.",
  keywords: ["Crowe Logic", "AI Consulting", "Drug Discovery", "Voice AI", "Claude AI", "Machine Learning", "Deep Consulting", "ParallelSynth"],
  authors: [{ name: "Michael Crowe" }],
  openGraph: {
    title: "Crowe Logic Studio | MichaelCrowe.ai",
    description: "Transform expertise into immersive, voice-first experiences.",
    url: "https://michaelcrowe.ai",
    siteName: "Crowe Logic Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crowe Logic Studio | MichaelCrowe.ai",
    description: "Transform expertise into immersive, voice-first experiences.",
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
