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

  const [genreAnalysis, setGenreAnalysis] = useState<{
    genre: string;
    isbns: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sharedBy, setSharedBy] = useState<string | null>(null);
  const { fetchMultipleBooks } = useGoogleBooksAPI();
  const { fetchMultipleCovers } = useOpenLibraryAPI();

  const processBooks = async (rawBooks: RawBook[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // First filter for current and previous year's books
      const filteredRawBooks = rawBooks.filter((book) => {
        const bookYear = new Date(book["Date Read"]).getFullYear();
        const isInYearRange = bookYear === currentYear || bookYear === currentYear - 1;
        const isRead = book["Exclusive Shelf"] === "read";
        return isInYearRange && isRead;
      });

      // Process only filtered books
      const allProcessedBooks = filteredRawBooks.map((book) => ({
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

      if (booksThisYear.length === 0) {
        setError(
          `Seems like there aren't any books read in ${currentYear}. You can add books by setting "Date Read" for each book on your Goodreads book list to any time in ${currentYear}.`
        );
        setIsLoading(false);
        return;
      }

      // Separate books with and without ISBNs (only for current year)
      const booksWithISBN = booksThisYear.filter((book) => book.isbn !== "");
      const booksWithoutISBN = booksThisYear.filter((book) => book.isbn === "");

      // Process both groups in parallel
      await Promise.all([
        // Process books with ISBN through OpenLibrary first, then Google Books as fallback
        (async () => {
          if (booksWithISBN.length > 0) {
            console.time("openLibrary");
            const openLibraryCoverUrls = await fetchMultipleCovers(
              booksWithISBN.map((book) => book.isbn)
            );
            console.timeEnd("openLibrary");

            booksWithISBN.forEach((book) => {
              book.coverUrl = openLibraryCoverUrls.get(book.isbn);
            });
          }
        })(),

        // Process books without ISBN through Google Books
        (async () => {
          if (booksWithoutISBN.length > 0) {
            console.time("googleBooks-withoutISBN");
            const googleBooksData = await fetchMultipleBooks(
              booksWithoutISBN.map((book) => ({
                title: book.title,
                author: book.author,
              }))
            );
            console.timeEnd("googleBooks-withoutISBN");

            booksWithoutISBN.forEach((book) => {
              const matchingBook = googleBooksData.find(
                (data) =>
                  data.title === book.title && data.author === book.author
              );

              if (matchingBook?.coverUrl) {
                book.coverUrl = matchingBook.coverUrl;
              }
              if (matchingBook?.isbn) {
                book.isbn = matchingBook.isbn;
              }
            });
          }
        })(),
      ]);

      // Store all books
      setBooks(allProcessedBooks);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Error processing books: ${err.message}`
          : "An unexpected error occurred while processing your books. Please try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearBooks = () => {
    setBooks([]);
    setGenreAnalysis(null);
    setSharedBy(null);
  };

  const loadSharedData = async (readerId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/get-data?id=${readerId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load shared data. Please try again."
        );
      }

      const processedBooks = data.books.map((book: any) => ({
        ...book,
        dateRead: new Date(book.dateRead),
      }));

      setBooks(processedBooks);
      setGenreAnalysis(data.genreAnalysis);
      setSharedBy(data.userName);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Failed to load shared data: ${err.message}`
          : "An unexpected error occurred while loading shared data. Please try again."
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    books,
    isLoading,
    error,
    processBooks,
    setProcessedBooks: setBooks,
    clearBooks,
    genreAnalysis,
    setGenreAnalysis,
    loadSharedData,
    sharedBy,
  };

  return (
    <BookDataContext.Provider value={value}>
      {children}
    </BookDataContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <BookDataProvider>{children}</BookDataProvider>;
}
