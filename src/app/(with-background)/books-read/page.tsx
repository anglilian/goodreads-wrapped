"use client";
import React from "react";
import { useBookData } from "@/hooks/useBookData";
import NavigationButtons from "@/components/ui/NavigationWrapper";

export default function BooksRead() {
  const { books } = useBookData();
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  // Filter for current year's books
  const thisYearBooks = books.filter(
    (book) => book.dateRead.getFullYear() === currentYear
  );

  const thisYearBookCount = thisYearBooks.length;

  // Filter for previous year's books
  const previousYearBooks = books.filter(
    (book) => book.dateRead.getFullYear() === previousYear
  );
  const previousYearBookCount = previousYearBooks.length;

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
          (that&apos;s{" "}
          <span className="text-secondary italic">{difference} more </span> than
          last year!)
        </span>
      );
    }

    // If fewer books were read this year
    return (
      <span>(that&apos;s {Math.abs(difference)} fewer than last year)</span>
    );
  };

  return (
    <div className="relative min-h-screen">
      {/* Content container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-0 gap-4">
        <div className="flex flex-col gap-4 items-center justify-center bg-background p-8 rounded-md">
          <h3>You read</h3>
          <h1>{getBookCountText()}</h1>
          <h5>{getComparisonText()}</h5>
          <NavigationButtons />
        </div>
      </div>
    </div>
  );
}
