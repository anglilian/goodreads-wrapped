import { useState, useCallback } from "react";

interface GoogleBooksResponse {
  items?: Array<{
    volumeInfo?: {
      industryIdentifiers?: Array<{
        type: string;
        identifier: string;
      }>;
    };
  }>;
}

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

  // Fetch single ISBN with retry logic
  const fetchISBN = useCallback(
    async (
      title: string,
      author: string,
      retryCount = 0
    ): Promise<string | null> => {
      try {
        const encodedTitle = encodeURIComponent(title);
        const encodedAuthor = encodeURIComponent(author);
        const url = `https://www.googleapis.com/books/v1/volumes?q=title:${encodedTitle}+authors:${encodedAuthor}`;

        const response = await fetch(url);

        if (response.status === 429 && retryCount < MAX_RETRIES) {
          // If rate limited, wait and retry
          await delay(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
          return fetchISBN(title, author, retryCount + 1);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: GoogleBooksResponse = await response.json();

        if (data.items?.[0]?.volumeInfo?.industryIdentifiers) {
          const identifiers = data.items[0].volumeInfo.industryIdentifiers;
          const isbn13 = identifiers.find((id) => id.type === "ISBN_13");
          const isbn10 = identifiers.find((id) => id.type === "ISBN_10");

          return isbn10?.identifier || isbn13?.identifier || null;
        }

        return null;
      } catch (err) {
        if (retryCount < MAX_RETRIES) {
          await delay(RETRY_DELAY * (retryCount + 1));
          return fetchISBN(title, author, retryCount + 1);
        }
        setError(err instanceof Error ? err.message : "Failed to fetch ISBN");
        return null;
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
          isbn: await fetchISBN(book.title, book.author),
        }))
      );
      return results;
    },
    [fetchISBN]
  );

  // Fetch multiple ISBNs with batching
  const fetchMultipleISBNs = useCallback(
    async (books: Array<{ title: string; author: string }>) => {
      setIsLoading(true);
      const results: Array<{
        title: string;
        author: string;
        isbn: string | null;
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
        setError(err instanceof Error ? err.message : "Failed to fetch ISBNs");
      } finally {
        setIsLoading(false);
      }

      return results;
    },
    [processBatch]
  );

  return {
    fetchISBN,
    fetchMultipleISBNs,
    isLoading,
    error,
  };
}
