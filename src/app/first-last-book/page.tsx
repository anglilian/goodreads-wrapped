"use client";
import React from "react";
import { useBookData } from "@/hooks/useBookData";
import NavigationButtons from "@/components/ui/NavigationWrapper";
import BookCoverCarousel from "@/components/top-books/BookCoverCarousel";

export default function FirstLastBook() {
  const { books, sharedBy } = useBookData();
  const currentYear = new Date().getFullYear();

  // Filter books by year
  const thisYearBooks = books.filter(
    (book) => book.dateRead.getFullYear() === currentYear
  );

  thisYearBooks.sort((a, b) => a.dateRead.getTime() - b.dateRead.getTime());

  // Get the first and last book of the year
  const firstBook = thisYearBooks[0];

  let lastBook;
  if (thisYearBooks.length === 1) {
    lastBook = firstBook;
  } else {
    lastBook = thisYearBooks[thisYearBooks.length - 1];
  }

  return (
    <div className="page-container">
      <div className="text-center gap-4">
        <h4>
          {sharedBy ? (
            <>
              {sharedBy} <span className="text-secondary italic mr-1">started </span> {currentYear} with
            </>
          ) : (
            <>
              You <span className="text-secondary italic mr-1">started </span> {currentYear} with
            </>
          )}
        </h4>
        <BookCoverCarousel books={[{ 
            coverUrl: firstBook.coverUrl as string, 
            title: firstBook.title, 
            author: firstBook.author 
            }]} />
        <h4>
          and <span className="text-secondary italic mr-1">ended</span> with
        </h4>
        <BookCoverCarousel books={[{ 
            coverUrl: lastBook.coverUrl as string, 
            title: lastBook.title, 
            author: lastBook.author 
            }]} />
      </div>

      <NavigationButtons />
    </div>
  );
}
