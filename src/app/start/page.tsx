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
    .filter((book) => book.coverUrl) // Only keep books that have a coverUrl
    .map((book) => book.coverUrl as string); // Convert to string array

  return (
    <div className="relative min-h-screen">
      <BookBackground coverUrls={coverUrls} />

      {/* Content container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background bg-opacity-90 gap-4">
        <div className="flex flex-col gap-1 items-center justify-center">
          <h2>Your</h2>
          <h1>{currentYear}</h1>
          <h2> in Books</h2>
        </div>

        <button className="btn-primary" onClick={handleStart}>
          Start
        </button>
      </div>
    </div>
  );
}
