"use client";

import { useState, useEffect } from "react";
import { useBookData } from "@/hooks/useBookData";
import BookCoverCarousel from "@/components/top-books/BookCoverCarousel";
import Loader from "@/components/app/Loader";
import EmojiButton from "@/components/ui/EmojiButton";
import NavigationButtons from "@/components/ui/NavigationWrapper";
import { parseGenreResponse } from "@/utils/parseGenreResponse";

export default function TopGenre() {
  const { books, genreAnalysis, setGenreAnalysis, sharedBy } = useBookData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const currentYear = new Date().getFullYear();

  // Filter books for current year
  const booksThisYear = books.filter(
    (book) => book.dateRead.getFullYear() === currentYear
  );

  // Function to fetch and analyze genre data
  const analyzeGenre = async () => {
    try {
      setLoading(true);
      setError("");

      const booksList = booksThisYear
        .map((book) => `${book.title} by ${book.author} (ISBN: ${book.isbn})`)
        .join("\n");

      const prompt = `${booksList}

Based on the above list of books, complete the sentence below using no more than 25 characters to state what the most read genre of this person is.

Then, determine all the books in the list which are in this genre. Extract the ISBN.

Your output should be online completing the sentence: "You read a lot about" and the list of ISBN from books in the list and in this genre with a line break between each ISBN.
`;

      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}. Details: ${errorText}`
        );
      }

      const data = await response.json();

      if (!data.response) {
        throw new Error("No response data received from API");
      }

      const { genre, isbns } = parseGenreResponse(data.response);
      setGenreAnalysis({ genre, isbns });
    } catch (error) {
      console.error("Detailed error:", error);
      setError(
        error instanceof Error
          ? `Error: ${error.message}. Check console for details.`
          : "An unexpected error occurred. Check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  // Only fetch genre analysis if we don't have it cached and there's no sharedBy (meaning it's not pre-filled data)
  useEffect(() => {
    if (!genreAnalysis && !loading && booksThisYear.length > 0 && !sharedBy) {
      analyzeGenre();
    }
  }, [genreAnalysis, loading, booksThisYear.length, sharedBy]);

  // Show error if present
  if (error) {
    return (
      <div className="page-container">
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded border border-red-300">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  // Show loading state only if no genre analysis
  if (!genreAnalysis && loading) {
    return (
      <div className="page-container">
        <Loader customText="Figuring out your top genre..." />
      </div>
    );
  }

  // Show analysis results
  if (genreAnalysis) {
    return (
      <div className="page-container">
        <div className="flex flex-col justify-center items-center gap-1">
          <h2>
            {sharedBy ? `${sharedBy} read a lot about` : "You read a lot about"}
          </h2>
          <h2 className="text-secondary italic">{genreAnalysis.genre}</h2>
        </div>
        {genreAnalysis.isbns.length > 0 && (
          <div className="mt-2">
            <BookCoverCarousel
              coverUrls={booksThisYear
                .filter((book) => genreAnalysis.isbns.includes(book.isbn))
                .map((book) => book.coverUrl)
                .filter((url): url is string => url !== undefined)}
            />
          </div>
        )}
        <h5>
          (
          <span className="text-secondary italic">
            {genreAnalysis.isbns.length}{" "}
            {genreAnalysis.isbns.length === 1 ? "book" : "books"}
          </span>{" "}
          to be exact)
        </h5>
        <EmojiButton emoji="🙌" />
        <NavigationButtons />
      </div>
    );
  }

  // Finally show empty state
  return (
    <div className="page-container">
      <p>Oops, no reading analysis available.</p>
      <NavigationButtons />
    </div>
  );
}
