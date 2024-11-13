"use client";
import React from "react";
import { useBookData } from "@/hooks/useBookData";
import BookBackground from "@/components/books-read/BookBackground";
import NavigationButtons from "@/components/ui/NavigationWrapper";

export default function BooksRead() {
  const { books, previousYearBookCount } = useBookData();

  const thisYearBookCount = books.length;

  // Extract cover URLs, filtering out any undefined coverUrls
  const coverUrls = books
    .filter((book) => book.coverUrl) // Only keep books that have a coverUrl
    .map((book) => book.coverUrl as string); // Convert to string array

  // Determine the book count text
  const getBookCountText = () => {
    if (thisYearBookCount === 1) {
      return "1 book";
    }
    return `${thisYearBookCount} books`;
  };

  // Determine the comparison text based on the difference
  const getComparisonText = () => {
    const difference = thisYearBookCount - previousYearBookCount;

    // If the same number of books were read
    if (difference === 0) {
      return `(that's the same as last year)`;
    }

    // If more books were read this year
    if (difference >= 0) {
      return (
        <span>
          (that&apos;s <span className="text-secondary">{difference} more</span>{" "}
          than last year!)
        </span>
      );
    }

    // If fewer books were read this year
    return `(that's ${Math.abs(difference)} fewer than last year)`;
  };

  return (
    <div className="relative min-h-screen">
      <BookBackground coverUrls={coverUrls} />

      {/* Content container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-0 gap-4">
        <div className="flex flex-col gap-1 items-center justify-center bg-background p-8 rounded-md">
          <h2>You read</h2>
          <h1>{getBookCountText()}</h1>
          <h4>{getComparisonText()}</h4>
          <NavigationButtons />
        </div>
      </div>
    </div>
  );
}
