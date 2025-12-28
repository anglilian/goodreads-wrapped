"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export const PAGE_ORDER = [
  "/start",
  "/books-read",
  "/first-last-book",
  "/top-books",
  "/book-rating",
  "/pages-read",
  "/top-genre",
  "/summary",
] as const;

export function useKeyboardNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const currentPageIndex = PAGE_ORDER.indexOf(
    pathname as (typeof PAGE_ORDER)[number]
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && pathname !== "/start") {
        const prevPage = PAGE_ORDER[currentPageIndex - 1];
        if (prevPage) {
          router.push(prevPage);
        }
      } else if (event.key === "ArrowRight" && pathname !== "/summary") {
        const nextPage = PAGE_ORDER[currentPageIndex + 1];
        if (nextPage) {
          router.push(nextPage);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPageIndex, router, pathname]);

  return {
    showNavigation: !(
      pathname === "/" ||
      currentPageIndex === -1 ||
      pathname === "/start" ||
      pathname === "/summary"
    ),
    currentPageIndex,
  };
}
