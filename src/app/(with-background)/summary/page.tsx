"use client";
import React from "react";
import { useBookData } from "@/hooks/useBookData";
import { useRouter } from "next/navigation";
import { RotateCcw, Share2 } from "lucide-react"; // Add Share2 import
import NavigationButtons from "@/components/ui/NavigationWrapper";

export default function Summary() {
  const { books } = useBookData();
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  // Filter current year's books
  const thisYearBooks = books.filter(
    (book) => book.dateRead.getFullYear() === currentYear
  );

  // Calculate total pages
  const totalPages = thisYearBooks.reduce(
    (sum, book) => sum + (book.numPages || 0),
    0
  );

  const handleReplay = async () => {
    await router.push("/start");
  };

  const handleShare = async () => {
    const text =
      `📚 My ${currentYear} in Books:\n` +
      `📖 ${thisYearBooks.length} books\n` +
      `📄 ${totalPages.toLocaleString()} pages\n` +
      `Check out your own reading year at goodreads-wrapped.anglilian.com`;

    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: `My ${currentYear} in Books`,
          text: text,
          url: "https://goodreads-wrapped.anglilian.com",
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        // You might want to add a toast notification here
        alert("Stats copied to clipboard!");
      } catch (error) {
        console.log("Error copying to clipboard:", error);
      }
    }
  };

  return (
    <div className="page-container">
      <div className="flex flex-col gap-4 items-center bg-background p-8 rounded-md">
        <div className="text-center space-y-2">
          <h3>{"That's a wrap for"}</h3>
          <h1>{currentYear}</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-rows-2 gap-2">
          <div className="grid grid-cols-2 gap-8 w-full">
            <div className="text-center space-y-2 bg-secondary-button bg-opacity-40 rounded-lg p-4">
              <h2 className="text-secondary">{thisYearBooks.length}</h2>
              <h5>books</h5>
            </div>
            <div className="text-center space-y-2 bg-secondary-button bg-opacity-40 rounded-lg p-4">
              <h2 className="text-secondary">{totalPages.toLocaleString()}</h2>
              <h5>pages</h5>
            </div>
          </div>
          <div className="text-center space-y-2 bg-secondary-button bg-opacity-40 rounded-lg p-4">
            <h5>top genre</h5>
            <h2 className="text-secondary">coming soon!</h2>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={handleReplay}
            className="btn-primary inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Play again
          </button>
        </div>
      </div>
      <NavigationButtons />
    </div>
  );
}
