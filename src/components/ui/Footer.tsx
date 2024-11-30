// src/components/ui/Footer.tsx
"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Only show footer on home page and summary page
  if (pathname !== "/" && pathname !== "/summary") {
    return null;
  }

  return (
    <footer className="fixed bottom-4 right-4 bg-background opacity-50 z-50">
      <p className="text-sm text-primary opacity-90">
        Made with ♡ by{" "}
        <a href="https://anglilian.com" target="_blank">
          Ang Li-Lian
        </a>{" "}
        © {currentYear}
      </p>
    </footer>
  );
}
