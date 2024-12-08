import { useState, useCallback } from "react";
import { getBookDataByISBN } from "./useGoogleBooksAPI";

// Rate limiting configuration
const RATE_LIMIT = {
  BATCH_SIZE: 20, // Process more books at once
  DELAY_ON_429: 5000, // Wait 5 seconds if we hit rate limit
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useOpenLibraryAPI() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoverUrl = useCallback(
    async (isbn: string, retries = 2): Promise<string | null> => {
      try {
        // Try OpenLibrary first
        const url = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
        const response = await fetch(url, {
          method: "HEAD",
          cache: "no-cache",
        });

        // If rate limited, wait and retry
        if (response.status === 429 && retries > 0) {
          await delay(RATE_LIMIT.DELAY_ON_429);
          return fetchCoverUrl(isbn, retries - 1);
        }

        if (response.ok) {
          const contentLength = response.headers.get("content-length");
          if (contentLength && parseInt(contentLength) > 1000) {
            return url;
          }
        }

        // If OpenLibrary doesn't have the cover, try Google Books API
        const googleBooksData = await getBookDataByISBN(isbn);
        return googleBooksData.coverUrl || null;
      } catch {
        return null;
      }
    },
    []
  );

  const fetchMultipleCovers = useCallback(
    async (isbns: string[]): Promise<Map<string, string>> => {
      setIsLoading(true);
      setError(null);
      const results = new Map<string, string>();

      try {
        // Process ISBNs in larger batches
        for (let i = 0; i < isbns.length; i += RATE_LIMIT.BATCH_SIZE) {
          const batch = isbns.slice(i, i + RATE_LIMIT.BATCH_SIZE);

          // Process batch in parallel
          const batchResults = await Promise.all(
            batch.map(async (isbn) => {
              const coverUrl = await fetchCoverUrl(isbn);
              return { isbn, coverUrl };
            })
          );

          // Store results
          batchResults.forEach(({ isbn, coverUrl }) => {
            if (coverUrl) results.set(isbn, coverUrl);
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch book covers"
        );
        console.error("Error fetching multiple covers:", err);
      } finally {
        setIsLoading(false);
      }

      return results;
    },
    [fetchCoverUrl]
  );

  return {
    fetchCoverUrl,
    fetchMultipleCovers,
    isLoading,
    error,
  };
}
