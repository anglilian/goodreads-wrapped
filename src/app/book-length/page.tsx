"use client";
import React from "react";
import { useBookData } from "@/hooks/useBookData";
import NavigationButtons from "@/components/ui/NavigationWrapper";
import BookStack from "@/components/pages-read/BookStack";
import EmojiButton from "@/components/ui/EmojiButton";

export default function BookLength() {
  const { books, sharedBy, goodreadsYear } = useBookData();

  // Filter books by year and sort by number of pages
  const thisYearBooks = books
    .filter((book) => book.dateRead.getFullYear() === goodreadsYear)
    .sort((a, b) => (b.numPages || 0) - (a.numPages || 0));

  // Calculate total pages for ratio
  const thisYearLongestBook = thisYearBooks.reduce(
    (max, book) => Math.max(max, book.numPages || 0),
    0
  );

  const thisYearShortestBook = thisYearBooks.reduce(
    (min, book) => Math.min(min, book.numPages || 0),
    Infinity
  );

  const thisYearAverageBook = thisYearBooks.length > 0 
    ? thisYearBooks.reduce((sum, book) => sum + (book.numPages || 0), 0) / thisYearBooks.length
    : 0;

  const thisYearTotalPages = thisYearBooks.reduce(
    (sum, book) => sum + (book.numPages || 0),
    0
  );

  var comparisonText = thisYearAverageBook >500 ? "chonky" : thisYearAverageBook < 200 ? "short and sweet" : "average-sized";

  return (
    <div className="page-container">
      <div className="text-center mb-4 flex flex-col gap-y-2">
        <h4>{sharedBy ? `${sharedBy} them` : "You like them"}</h4>
        <h2 className="text-secondary italic">{comparisonText}</h2>
        <p>(though you read a whole range of book lengths)</p>
      </div>

      <div className="relative flex justify-center items-end gap-16 mb-2">
        <div className="flex flex-row gap-6">
          <BookStack books={thisYearBooks} maxPages={thisYearTotalPages} />
          <div className="flex flex-col justify-between -mt-4">
            <h2 className="text-secondary-button">{thisYearShortestBook} pages</h2>
            <div className="flex flex-col">
                <h2 className="text-primary">{thisYearAverageBook.toFixed(0)} pages</h2>
                <p className="text-secondary-button">(your average book)</p>
            </div>
            <h2 className="text-secondary-button">{thisYearLongestBook} pages</h2>
          </div>
        </div>

        <div
          className="absolute bottom-0 w-full h-[2px] bg-secondary-button rounded-full -z-10"
          style={{
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      <EmojiButton emoji="📚" />

      <NavigationButtons />
    </div>
  );
}
