"use client";

import { Book, RawBook } from "@/types/books";
import { useState } from "react";

export function useBookData() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleBooks = (rawBooks: RawBook[]) => {
    setIsLoading(true);
    setError("");

    try {
      // Process the raw books into your desired format
      const processedBooks = rawBooks.map((book) => ({
        isbn: book.ISBN,
        rating: book["My Rating"]
          ? parseInt(book["My Rating"]) || undefined
          : undefined,
        title: book.Title,
        author: book.Author,
        numPages: book["Number of Pages"]
          ? parseInt(book["Number of Pages"]) || undefined
          : undefined,
        dateRead: new Date(book["Date Read"]),
      }));

      setBooks(processedBooks);
    } catch (err) {
      setError("Error processing books data");
      console.error(err);
    }

    setIsLoading(false);
  };

  return {
    books,
    isLoading,
    error,
    handleBooks,
  };
}
