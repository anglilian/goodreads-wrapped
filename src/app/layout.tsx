// src/app/layout.tsx
import type { Metadata } from "next";
import { Lato, Merriweather } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/BookDataContext";
import Footer from "@/components/ui/Footer";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://goodreads-wrapped.anglilian.com"),
  title: "Goodreads Wrapped",
  description: "Visualise your year in books",
  keywords: ["books", "reading", "goodreads", "wrapped", "year in review"],
  authors: [{ name: "Ang Li-Lian", url: "https://anglilian.com" }],
  icons: {
    icon: [
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon.ico" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/favicon/site.webmanifest",
  appleWebApp: {
    title: "Goodreads Wrapped",
  },
  openGraph: {
    title: "Goodreads Wrapped",
    description: "Visualize your year in books with Goodreads Wrapped",
    url: "https://goodreads-wrapped.anglilian.com",
    siteName: "Goodreads Wrapped",
    // images: [
    //   {
    //     url: "/og-image.png",
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} ${merriweather.variable} font-lato bg-background h-screen flex flex-col items-center overflow-hidden`}
      >
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
