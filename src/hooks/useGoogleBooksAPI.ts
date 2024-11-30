import { useState, useCallback } from "react";
import { GoogleBooksResponse } from "@/types/api_response";
import { fetchWithRetry } from "@/utils/fetchWithRetry";

const BATCH_SIZE = 10; // Process 10 books at a time
const BATCH_DELAY = 1000; // 1 second between batches

// Add this helper function at the top with the other utility functions
function getEnhancedCoverUrl(volumeInfo?: {
  imageLinks?: {
    thumbnail?: string;
  };
  printType?: string;
}): string | undefined {
  if (!volumeInfo?.imageLinks?.thumbnail) return undefined;

  return volumeInfo.imageLinks.thumbnail
    .replace("http:", "https:")
    .replace("zoom=1", "zoom=2")
    .replace("&edge=curl", "")
    .replace("&fife=w200-h300", "");
}

// Core function to fetch from Google Books API
async function fetchGoogleBooks(query: string): Promise<GoogleBooksResponse> {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Function to get book data by ISBN
export async function getBookDataByISBN(
  isbn: string
): Promise<{ coverUrl?: string }> {
  try {
    const data = await fetchWithRetry(() => fetchGoogleBooks(`isbn:${isbn}`));
    const coverUrl = getEnhancedCoverUrl(data.items?.[0]?.volumeInfo);

    return { coverUrl };
  } catch (err) {
    console.error("Error fetching by ISBN:", err);
    return {};
  }
}

// Function to get book data by title and author
export async function getBookDataByTitleAuthor(
  title: string,
  author: string
): Promise<{ isbn: string; coverUrl?: string }> {
  try {
    const query = `title:${encodeURIComponent(
      title
    )}+authors:${encodeURIComponent(author)}`;
    const data = await fetchWithRetry(() => fetchGoogleBooks(query));

    const firstBook = data.items?.[0]?.volumeInfo;
    const identifiers = firstBook?.industryIdentifiers || [];
    const isbn13 = identifiers.find((id) => id.type === "ISBN_13");
    const isbn10 = identifiers.find((id) => id.type === "ISBN_10");
    const coverUrl = getEnhancedCoverUrl(firstBook);

    return {
      isbn: isbn13?.identifier || isbn10?.identifier || "",
      coverUrl,
    };
  } catch (err) {
    console.error("Error fetching by title/author:", err);
    return { isbn: "" };
  }
}

// Hook to manage state and expose functionality
export function useGoogleBooksAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookData = useCallback(
    async (params: { isbn: string } | { title: string; author: string }) => {
      setIsLoading(true);
      setError(null);

      try {
        if ("isbn" in params) {
          return await getBookDataByISBN(params.isbn);
        } else {
          return await getBookDataByTitleAuthor(params.title, params.author);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch book data"
        );
        return "isbn" in params ? {} : { isbn: "" };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Function to process multiple books in batches
  const processBatch = useCallback(
    async (
      books: Array<{ title: string; author: string }>,
      startIndex: number
    ) => {
      const batchBooks = books.slice(startIndex, startIndex + BATCH_SIZE);
      const results = await Promise.all(
        batchBooks.map(async (book) => ({
          ...book,
          ...(await getBookDataByTitleAuthor(book.title, book.author)),
        }))
      );
      return results;
    },
    []
  );

  const fetchMultipleBooks = useCallback(
    async (books: Array<{ title: string; author: string }>) => {
      setIsLoading(true);
      const results = [];

      try {
        for (let i = 0; i < books.length; i += BATCH_SIZE) {
          const batchResults = await processBatch(books, i);
          results.push(...batchResults);

          if (i + BATCH_SIZE < books.length) {
            await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
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
    fetchMultipleBooks,
    isLoading,
    error,
  };
}
