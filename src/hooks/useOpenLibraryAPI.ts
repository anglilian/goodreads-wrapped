import { useState, useCallback } from "react";
import { fetchWithRetry } from "@/utils/fetchWithRetry";

async function verifyImageExists(url: string): Promise<boolean> {
  try {
    // Create a new image element
    const img = new Image();

    const imageLoadPromise = new Promise<boolean>((resolve) => {
      img.onload = () => {
        // Check if the image is the 1x1 placeholder
        if (img.width === 1 && img.height === 1) {
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.onerror = () => resolve(false);
    });

    img.src = url;
    return await imageLoadPromise;
  } catch {
    return false;
  }
}

export function useOpenLibraryAPI() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoverUrl = useCallback(
    async (isbn: string): Promise<string | null> => {
      try {
        const url = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
        const hasValidCover = await fetchWithRetry(() =>
          verifyImageExists(url)
        );

        return hasValidCover ? url : null;
      } catch (err) {
        console.error(`Error fetching cover for ISBN ${isbn}:`, err);
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
        // Process 10 books at a time
        for (let i = 0; i < isbns.length; i += 10) {
          const batch = isbns.slice(i, i + 10);
          const batchPromises = batch.map(async (isbn) => {
            const coverUrl = await fetchCoverUrl(isbn);
            if (coverUrl) {
              results.set(isbn, coverUrl);
            }
          });

          await Promise.all(batchPromises);

          // Wait 5 seconds between batches to respect rate limit
          if (i + 10 < isbns.length) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
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
