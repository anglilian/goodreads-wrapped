import { useState, useCallback } from "react";
import { GoogleBooksResponse } from "@/types/api_response";
import { Book } from "@/types/books";

type PartialBook = Pick<Book, "isbn" | "coverUrl">;

const RETRY_DELAY = 2000; // 2 seconds between retries
const MAX_RETRIES = 3;
const BATCH_SIZE = 10; // Process 10 books at a time
const BATCH_DELAY = 1000; // 1 second between batches

export function useFetchISBN() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to delay execution
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Fetch single book data with retry logic
  const fetchBookData = useCallback(
    async (
      title: string,
      author: string,
      retryCount = 0
    ): Promise<PartialBook> => {
      try {
        const encodedTitle = encodeURIComponent(title);
        const encodedAuthor = encodeURIComponent(author);
        const url = `https://www.googleapis.com/books/v1/volumes?q=title:${encodedTitle}+authors:${encodedAuthor}`;

        const response = await fetch(url);

        if (response.status === 429 && retryCount < MAX_RETRIES) {
          // If rate limited, wait and retry
          await delay(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
          return fetchBookData(title, author, retryCount + 1);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: GoogleBooksResponse = await response.json();
        const firstBook = data.items?.[0]?.volumeInfo;

        if (firstBook) {
          const identifiers = firstBook.industryIdentifiers;
          const isbn13 = identifiers?.find((id) => id.type === "ISBN_13");
          const isbn10 = identifiers?.find((id) => id.type === "ISBN_10");
          const coverUrl = firstBook.imageLinks?.thumbnail || undefined;

          return {
            isbn: isbn13?.identifier || isbn10?.identifier || "",
            coverUrl: coverUrl
              ? coverUrl.replace("http:", "https:")
              : undefined,
          };
        }

        return { isbn: "", coverUrl: undefined };
      } catch (err) {
        if (retryCount < MAX_RETRIES) {
          await delay(RETRY_DELAY * (retryCount + 1));
          return fetchBookData(title, author, retryCount + 1);
        }
        setError(
          err instanceof Error ? err.message : "Failed to fetch book data"
        );
        return { isbn: "", coverUrl: undefined };
      }
    },
    []
  );

  // Process books in batches
  const processBatch = useCallback(
    async (
      books: Array<{ title: string; author: string }>,
      startIndex: number
    ) => {
      const batchBooks = books.slice(startIndex, startIndex + BATCH_SIZE);
      const results = await Promise.all(
        batchBooks.map(async (book) => ({
          ...book,
          ...(await fetchBookData(book.title, book.author)),
        }))
      );
      return results;
    },
    [fetchBookData]
  );

  // Fetch multiple books' data with batching
  const fetchMultipleISBNs = useCallback(
    async (books: Array<{ title: string; author: string }>) => {
      setIsLoading(true);
      const results: Array<{
        title: string;
        author: string;
        isbn: string;
        coverUrl?: string;
      }> = [];

      try {
        // Process books in batches
        for (let i = 0; i < books.length; i += BATCH_SIZE) {
          const batchResults = await processBatch(books, i);
          results.push(...batchResults);

          // Wait between batches if there are more to process
          if (i + BATCH_SIZE < books.length) {
            await delay(BATCH_DELAY);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch book data"
        );
      } finally {
        setIsLoading(false);
      }

      return results;
    },
    [processBatch]
  );

  return {
    fetchBookData,
    fetchMultipleISBNs,
    isLoading,
    error,
  };
}
