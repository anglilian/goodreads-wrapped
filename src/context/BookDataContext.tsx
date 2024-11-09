"use client";
import { createContext, useState, ReactNode } from "react";
import { BookDataContextType, Book, RawBook } from "@/types/books";
import { useFetchISBN } from "@/hooks/useFetchISBN";

export const BookDataContext = createContext<BookDataContextType | undefined>(
  undefined
);

const cleanISBN = (isbn: string): string => {
  return isbn.replace(/^=?"?|"?$/g, "").trim();
};

const isThisYear = (date: Date): boolean => {
  const currentYear = new Date().getFullYear();
  return date.getFullYear() === currentYear;
};

export function BookDataProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchMultipleISBNs } = useFetchISBN();

  const processBooks = async (rawBooks: RawBook[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const initialProcessedBooks = rawBooks.map((book) => {
        const dateRead = new Date(book["Date Read"]);
        const cleanedISBN = book.ISBN ? cleanISBN(book.ISBN) : null;

        return {
          isbn: cleanedISBN ? cleanedISBN : "",
          rating: book["My Rating"]
            ? parseInt(book["My Rating"]) || undefined
            : undefined,
          title: book.Title,
          author: book.Author,
          numPages: book["Number of Pages"]
            ? parseInt(book["Number of Pages"]) || undefined
            : undefined,
          dateRead: dateRead,
        };
      });

      // Filter books that need ISBN fetching
      const booksNeedingISBN = initialProcessedBooks
        .filter(
          (book) =>
            isThisYear(book.dateRead) && // Only process books from this year
            (!book.isbn || book.isbn.length < 10)
        )
        .map((book) => ({
          title: book.title,
          author: book.author,
        }));

      // If there are books needing ISBN, fetch them
      if (booksNeedingISBN.length > 0) {
        const fetchedISBNs = await fetchMultipleISBNs(booksNeedingISBN);

        // Create a map of title+author to ISBN for easy lookup
        const isbnMap = new Map(
          fetchedISBNs.map((book) => [
            `${book.title}-${book.author}`,
            book.isbn,
          ])
        );

        // Update the processed books with fetched ISBNs
        const finalProcessedBooks = initialProcessedBooks.map((book) => {
          if (!book.isbn) {
            const fetchedISBN = isbnMap.get(`${book.title}-${book.author}`);
            return {
              ...book,
              isbn: fetchedISBN || "", // Use fetched ISBN or empty string if not found
            };
          }
          return book;
        });
        setBooks(finalProcessedBooks);
      } else {
        // If no books need ISBN fetching, use the initial processing
        setBooks(initialProcessedBooks);
      }
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
