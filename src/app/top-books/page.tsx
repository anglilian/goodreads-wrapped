"use client";
import { useBookData } from "@/hooks/useBookData";
import Ratings from "@/components/top-books/Ratings";
import HorizontalCarousel from "@/components/top-books/HorizontalCarousel";
import NavigationButtons from "@/components/ui/NavigationWrapper";

export default function TopBooks() {
  const { books } = useBookData();

  const fiveStarBooks = books
    .filter((book) => book.rating === 5)
    .map((book) => book.coverUrl as string); // Convert to string array
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-fit gap-y-6">
      <h4>Remember these?</h4>
      <HorizontalCarousel coverUrls={fiveStarBooks}></HorizontalCarousel>
      <h2>
        You <span className="text-secondary italic">really</span> loved them
      </h2>
      <Ratings rating={5}></Ratings>
      <NavigationButtons />
    </div>
  );
}
