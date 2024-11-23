"use client";
import { createContext, useState, ReactNode, useEffect } from "react";
import { BookDataContextType, Book, RawBook } from "@/types/books";
import { useGoogleBooksAPI } from "@/hooks/useGoogleBooksAPI";
import { useOpenLibraryAPI } from "@/hooks/useOpenLibraryAPI";

export const BookDataContext = createContext<BookDataContextType | undefined>(
  undefined
);

const STORAGE_KEY = "goodreads_wrapped_books";

const cleanISBN = (isbn: string): string => {
  return isbn.replace(/^=?"?|"?$/g, "").trim();
};

const currentYear = new Date().getFullYear();

export function BookDataProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  // Initialize state from localStorage if available
  const [books, setBooks] = useState<Book[]>(() => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Restore Date objects from JSON strings
        return parsed.map((book: any) => ({
          ...book,
          dateRead: new Date(book.dateRead),
        }));
      } catch (e) {
        console.error("Error parsing stored books:", e);
        return [];
      }
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchMultipleBooks } = useGoogleBooksAPI();
  const { fetchMultipleCovers } = useOpenLibraryAPI();

  // Save to localStorage whenever books change
  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  }, [books]);

  const setProcessedBooks = (processedBooks: Book[]) => {
    setBooks(processedBooks);
  };

  const processBooks = async (rawBooks: RawBook[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // Process all books to get basic data and counts
      const allProcessedBooks = rawBooks.map((book) => ({
        isbn: book.ISBN ? cleanISBN(book.ISBN) : "",
        rating: book["My Rating"]
          ? parseInt(book["My Rating"]) || undefined
          : undefined,
        title: book.Title,
        author: book.Author,
        numPages: book["Number of Pages"]
          ? parseInt(book["Number of Pages"]) || undefined
          : undefined,
        dateRead: new Date(book["Date Read"]),
      })) as Book[];

      // Only process current year's books for API calls
      const booksThisYear = allProcessedBooks.filter(
        (book) => book.dateRead.getFullYear() === currentYear
      );

      // Separate books with and without ISBNs (only for current year)
      const booksWithISBN = booksThisYear.filter((book) => book.isbn !== "");
      const booksWithoutISBN = booksThisYear.filter((book) => book.isbn === "");

      // Remove duplicate block and keep only one instance of OpenLibrary cover fetching
      if (booksWithISBN.length > 0) {
        const openLibraryCoverUrls = await fetchMultipleCovers(
          booksWithISBN.map((book) => book.isbn)
        );

        booksWithISBN.forEach((book) => {
          book.coverUrl = openLibraryCoverUrls.get(book.isbn);
        });
      }

      // 2. For books with ISBN but missing covers, try Google Books
      const booksNeedingGoogleCovers = booksWithISBN.filter(
        (book) => !book.coverUrl
      );

      if (booksNeedingGoogleCovers.length > 0) {
        const googleBooksData = await fetchMultipleBooks(
          booksNeedingGoogleCovers.map((book) => ({
            title: book.title,
            author: book.author,
          }))
        );

        const googleBooksMap = new Map(
          googleBooksData.map((book) => [
            `${book.title}-${book.author}`,
            book.coverUrl,
          ])
        );

        booksNeedingGoogleCovers.forEach((book) => {
          book.coverUrl = googleBooksMap.get(`${book.title}-${book.author}`);
        });
      }

      // 3. For books without ISBN, get both ISBN and cover from Google Books
      if (booksWithoutISBN.length > 0) {
        const googleBooksData = await fetchMultipleBooks(
          booksWithoutISBN.map((book) => ({
            title: book.title,
            author: book.author,
          }))
        );

        const googleBooksMap = new Map(
          googleBooksData.map((book) => [
            `${book.title}-${book.author}`,
            [book.isbn, book.coverUrl] as const,
          ])
        );

        booksWithoutISBN.forEach((book) => {
          const data = googleBooksMap.get(`${book.title}-${book.author}`);
          if (data) {
            book.isbn = data[0] || "";
            book.coverUrl = data[1];
          }
        });
      }

      // Store all books, but only current year's books will have cover URLs
      setBooks(allProcessedBooks);
    } catch (err) {
      setError("Error processing books data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearBooks = () => {
    setBooks([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <BookDataContext.Provider
      value={{
        books,
        isLoading,
        error,
        processBooks,
        setProcessedBooks,
        clearBooks,
      }}
    >
      {children}
    </BookDataContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <BookDataProvider>{children}</BookDataProvider>;
}
