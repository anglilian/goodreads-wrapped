"use client";

import { usePathname } from "next/navigation";
import NavigationButton from "./NavigationButton";

const PAGE_ORDER = [
  "/start",
  "/books-read",
  "/top-books",
  "/book-rating",
  "/pages-read",
  "/top-genre",
  "/top-genre-books",
  "/summary",
];

export default function NavigationButtons() {
  const pathname = usePathname();
  const currentPageIndex = PAGE_ORDER.indexOf(pathname);

  // Don't show navigation on welcome page
  if (
    pathname === "/" ||
    currentPageIndex === -1 ||
    pathname === "/summary" ||
    pathname === "/start"
  ) {
    return null;
  }

  // Only show next button on first content page
  if (pathname === "/books-read") {
    return (
      <div className="flex px-4 mt-8">
        <NavigationButton
          direction="next"
          href={PAGE_ORDER[currentPageIndex + 1]}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-between w-full px-4 mt-8">
      <NavigationButton
        direction="previous"
        href={PAGE_ORDER[currentPageIndex - 1]}
      />
      <NavigationButton
        direction="next"
        href={PAGE_ORDER[currentPageIndex + 1]}
      />
    </div>
  );
}
