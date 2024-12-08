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
}): string | undefined {
  if (!volumeInfo?.imageLinks?.thumbnail) return undefined;

  const thumbnail = volumeInfo.imageLinks.thumbnail;

  // Check if it's the default "no cover" image (575x750)

  const img = new Image();
  img.src = thumbnail;
  if (img.width === 575 && img.height === 750) {
    return undefined;
  }

  return thumbnail
    .replace("http:", "https:")
    .replace("&edge=curl", "")
    .replace("&fife=w200-h300", "");
}

// Core function to fetch from Google Books API
async function fetchGoogleBooks(query: string): Promise<GoogleBooksResponse> {
  console.log(query);
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
    let coverUrl = getEnhancedCoverUrl(data.items?.[0]?.volumeInfo);

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
): Promise<{ isbn?: string; coverUrl?: string }> {
  try {
    const data = await fetchWithRetry(() =>
      fetchGoogleBooks(
        `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(
          author
        )}`
      )
    );

    const firstBook = data.items?.[0]?.volumeInfo;
    const [isbn13, isbn10] = (firstBook?.industryIdentifiers ?? [])
      .filter((id) => id.type === "ISBN_13" || id.type === "ISBN_10")
      .sort((a, b) => (a.type === "ISBN_10" ? -1 : 1)); // Prioritize ISBN_10
    const isbn = isbn10?.identifier ?? isbn13?.identifier;
    const coverUrl = getEnhancedCoverUrl(firstBook);

    return { isbn, coverUrl };
  } catch (err) {
    console.error(`Error fetching ${title} by ${author}`, err);
    return {};
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

  const fetchMultipleBooks = useCallback(
    async (books: Array<{ title: string; author: string }>) => {
      setIsLoading(true);
      const results = [];
      const booksWithoutCovers: string[] = [];

      try {
        for (let i = 0; i < books.length; i += BATCH_SIZE) {
          const batchBooks = books.slice(i, i + BATCH_SIZE);
          const batchResults = await Promise.all(
            batchBooks.map(async (book) => {
              const result = await getBookDataByTitleAuthor(
                book.title,
                book.author
              );

              if (!result.coverUrl) {
                booksWithoutCovers.push(`${book.title} by ${book.author}`);
              }

              return {
                ...book,
                ...result,
              };
            })
          );
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

      if (booksWithoutCovers.length > 0) {
        console.warn("Books without covers:", booksWithoutCovers.join("\n"));
      }

      return results;
    },
    []
  );

  return {
    fetchBookData,
    fetchMultipleBooks,
    isLoading,
    error,
  };
}
