"use client";
import React from "react";
import { useBookData } from "@/hooks/useBookData";
import NavigationButtons from "@/components/ui/NavigationWrapper";
import BookStack from "@/components/pages-read/BookStack";
import EmojiButton from "@/components/ui/EmojiButton";

export default function PagesRead() {
  const { books, sharedBy } = useBookData();
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  // Filter books by year
  const thisYearBooks = books.filter(
    (book) => book.dateRead.getFullYear() === currentYear
  );
  const lastYearBooks = books.filter(
    (book) => book.dateRead.getFullYear() === lastYear
  );

  // Calculate total pages for ratio
  const thisYearPages = thisYearBooks.reduce(
    (sum, book) => sum + (book.numPages || 0),
    0
  );
  const lastYearPages = lastYearBooks.reduce(
    (sum, book) => sum + (book.numPages || 0),
    0
  );

  const ratio = (thisYearPages / lastYearPages).toFixed(1);

  // Calculate max pages for proportional scaling
  const maxPages = Math.max(thisYearPages, lastYearPages);

  return (
    <div className="page-container">
      <div className="text-center gap-2">
        <h4>{sharedBy ? `${sharedBy} read` : "You read"}</h4>
        <h1>{thisYearPages.toLocaleString()} pages</h1>
        <h5 className="mt-4">
          {"(that's "}
          <span className="text-secondary font-bold">
            {thisYearPages === lastYearPages
              ? "the same amount"
              : thisYearPages > lastYearPages
              ? `${ratio} times more`
              : `${(lastYearPages / thisYearPages).toFixed(1)} times less`}
          </span>
          {" than last year!)"}
        </h5>
      </div>

      <EmojiButton emoji="😲" />

      <div className="relative flex justify-center items-end gap-16 mb-2">
        <div className="flex flex-col items-center">
          <h2 className="text-secondary-button">{lastYear}</h2>
          <BookStack books={lastYearBooks} maxPages={maxPages} />
        </div>

        <div className="flex flex-col items-center">
          <h2>{currentYear}</h2>
          <BookStack books={thisYearBooks} maxPages={maxPages} />
        </div>

        <div
          className="absolute bottom-0 w-full h-[2px] bg-secondary-button rounded-full -z-10"
          style={{
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      <NavigationButtons />
    </div>
  );
}
