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

export function useFetchISBN() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchISBN = useCallback(
    async (title: string, author: string): Promise<string | null> => {
      setIsLoading(true);
      setError(null);

      try {
        // URL encode the title and author
        const encodedTitle = encodeURIComponent(title);
        const encodedAuthor = encodeURIComponent(author);

        // Construct the API URL
        const url = `https://www.googleapis.com/books/v1/volumes?q=title:${encodedTitle}+authors:${encodedAuthor}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: GoogleBooksResponse = await response.json();

        // Check if we have results and industry identifiers
        if (data.items?.[0]?.volumeInfo?.industryIdentifiers) {
          // Try to find ISBN-13 first, fall back to ISBN-10
          const identifiers = data.items[0].volumeInfo.industryIdentifiers;
          const isbn13 = identifiers.find((id) => id.type === "ISBN_13");
          const isbn10 = identifiers.find((id) => id.type === "ISBN_10");

          // Return ISBN-10 if available, otherwise ISBN-13, or null if neither exists
          return isbn10?.identifier || isbn13?.identifier || null;
        }

        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch ISBN");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Function to fetch ISBNs for multiple books
  const fetchMultipleISBNs = useCallback(
    async (books: Array<{ title: string; author: string }>) => {
      const results = await Promise.all(
        books.map(async (book) => {
          // Add delay between requests to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 100));
          return {
            ...book,
            isbn: await fetchISBN(book.title, book.author),
          };
        })
      );
      return results;
    },
    [fetchISBN]
  );

  return {
    fetchISBN,
    fetchMultipleISBNs,
    isLoading,
    error,
  };
}
