import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Michael Crowe | AI Consultant & Drug Discovery Specialist",
  description: "Pioneering AI solutions in drug discovery and cultivation intelligence. Expert in Claude 4.5 Opus, custom ML models, and enterprise AI deployment.",
  keywords: ["AI Consultant", "Drug Discovery", "Machine Learning", "Claude AI", "Mushroom Cultivation", "ML Datasets"],
  authors: [{ name: "Michael Crowe" }],
  openGraph: {
    title: "Michael Crowe | AI Consultant",
    description: "Pioneering AI solutions in drug discovery and cultivation intelligence.",
    url: "https://michaelcrowe.ai",
    siteName: "MichaelCrowe.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Michael Crowe | AI Consultant",
    description: "Pioneering AI solutions in drug discovery and cultivation intelligence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
