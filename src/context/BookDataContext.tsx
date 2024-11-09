"use client";
import { createContext, useState, ReactNode } from "react";
import { BookDataContextType, Book, RawBook } from "@/types/books";

export const BookDataContext = createContext<BookDataContextType | undefined>(
  undefined
);

export function BookDataProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processBooks = (rawBooks: RawBook[]) => {
    setIsLoading(true);
    setError(null);

    try {
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Make sure there's a return statement here
    <BookDataContext.Provider
      value={{
        books,
        isLoading,
        error,
        processBooks,
      }}
    >
      {children}
    </BookDataContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <BookDataProvider>{children}</BookDataProvider>;
}
