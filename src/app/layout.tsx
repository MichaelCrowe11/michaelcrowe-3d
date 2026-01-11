import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

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

const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
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
