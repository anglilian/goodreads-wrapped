import { useState, useEffect } from "react";

export function useFetchBookCover(isbn: string) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyImageExists = async (url: string): Promise<boolean> => {
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
    };

    const fetchCoverUrl = async () => {
      if (!isbn) {
        setError("No ISBN provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Try OpenLibrary first
        const openLibraryUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
        const hasOpenLibraryCover = await verifyImageExists(openLibraryUrl);

        if (hasOpenLibraryCover) {
          setCoverUrl(openLibraryUrl);
          setIsLoading(false);
          return;
        }

        // Fallback to Google Books API
        const googleBooksResponse = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
        );
        const data = await googleBooksResponse.json();

        if (data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail) {
          setCoverUrl(data.items[0].volumeInfo.imageLinks.thumbnail);
        } else {
          setCoverUrl(null);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch book cover"
        );
        setCoverUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoverUrl();
  }, [isbn]);

  return { coverUrl, isLoading, error };
}
