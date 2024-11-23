"use client";
import React from "react";
import { useBookData } from "@/hooks/useBookData";
import BookBackground from "@/components/books-read/BookBackground";
import { useRouter } from "next/navigation";

export default function StartPage() {
  const { books } = useBookData();
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const handleStart = async () => {
    await router.push("/books-read");
  };

  // Extract cover URLs, filtering out any undefined coverUrls
  const coverUrls = books
    .filter(
      (book) => book.coverUrl && book.dateRead.getFullYear() === currentYear
    ) // Only keep books that have a coverUrl and are from the current year
    .map((book) => book.coverUrl as string); // Convert to string array

  return (
    <div className="relative min-h-screen">
      <BookBackground coverUrls={coverUrls} />

      {/* Content container */}
      <div className="absolute inset-0 bg-background bg-opacity-90 flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center text-center gap-1">
          <h3>Your</h3>
          <h1>{currentYear}</h1>
          <h3> in Books</h3>
        </div>

        <button className="btn-primary" onClick={handleStart}>
          Start
        </button>
      </div>
    </div>
  );
}
