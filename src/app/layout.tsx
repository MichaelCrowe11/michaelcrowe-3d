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
  title: "Michael Crowe | Where real-world biology meets computation",
  description: "Founder of Crowe Logic and operator of Southwest Mushrooms since 2017. A portfolio of 26 DOI-backed works across cultivation intelligence, computational drug discovery, and research software.",
  keywords: ["Michael Crowe", "Crowe Logic", "cheminformatics", "drug discovery", "QSAR", "virtual screening", "RDKit", "natural products", "applied mycology", "cultivation telemetry"],
  authors: [{ name: "Michael Crowe" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Michael Crowe",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Michael Crowe | Where real-world biology meets computation",
    description: "Founder of Crowe Logic. Cultivating since 2005, commercial since 2017. 26 DOI-backed works across cultivation intelligence, drug discovery, and research software.",
    url: "https://michaelcrowe.ai",
    siteName: "Michael Crowe",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Michael Crowe | Where real-world biology meets computation",
    description: "Founder of Crowe Logic. Cultivating since 2005, commercial since 2017. 26 DOI-backed works, all resolvable.",
  },
};

import { LiquidCursor } from '@/components/ui/LiquidCursor';
import { PWARegistration } from '@/components/PWARegistration';
import { GlobalSideNav } from '@/components/layout/GlobalSideNav';

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
        <meta name="theme-color" content="#050506" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="grain font-sans antialiased selection:bg-[#d2ad62]/40 selection:text-black cursor-none">
        <LiquidCursor />
        <div className="relative min-h-screen bg-[#050506]">
          <GlobalSideNav />
          <main className="pl-20 md:pl-24">
            {children}
          </main>
        </div>
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
          colorPrimary: "#d4a15f",
          colorBackground: "#050506",
        },
      }}
    >
      {content}
    </ClerkProvider>
  );
}
