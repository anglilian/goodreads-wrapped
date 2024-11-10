"use client";
import { createContext, useState, ReactNode } from "react";
import { BookDataContextType, Book, RawBook } from "@/types/books";
import { useGoogleBooksAPI } from "@/hooks/useGoogleBooksAPI";
import { useOpenLibraryAPI } from "@/hooks/useOpenLibraryAPI";

export const BookDataContext = createContext<BookDataContextType | undefined>(
  undefined
);

const cleanISBN = (isbn: string): string => {
  return isbn.replace(/^=?"?|"?$/g, "").trim();
};

const currentYear = new Date().getFullYear();

export function BookDataProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchMultipleBooks } = useGoogleBooksAPI();
  const { fetchMultipleCovers } = useOpenLibraryAPI();

  const processBooks = async (rawBooks: RawBook[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const initialProcessedBooks = rawBooks.map((book) => {
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
          dateRead: new Date(book["Date Read"]),
        };
      }) as Book[];

      // Filter for books read this year
      const booksThisYear = initialProcessedBooks.filter(
        (book) => book.dateRead.getFullYear() === currentYear
      );

      // Separate books with and without ISBNs
      const booksWithISBN = booksThisYear.filter((book) => book.isbn !== "");
      const booksWithoutISBN = booksThisYear.filter((book) => book.isbn === "");

      // 1. Get OpenLibrary covers for books with ISBNs
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

      // Combine all processed books
      setBooks([...booksWithISBN, ...booksWithoutISBN]);
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
