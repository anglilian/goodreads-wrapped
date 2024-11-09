// src/app/layout.tsx
import type { Metadata } from "next";
import { Lato, Merriweather } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/BookDataContext";

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
  title: "Goodreads Wrapped",
  description: "Visualize your year in books",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} ${merriweather.variable} font-lato bg-background`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
