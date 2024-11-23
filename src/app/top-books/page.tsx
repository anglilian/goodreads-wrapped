"use client";
import { useBookData } from "@/hooks/useBookData";
import Ratings from "@/components/top-books/Ratings";
import BookCoverCarousel from "@/components/top-books/BookCoverCarousel";
import NavigationButtons from "@/components/ui/NavigationWrapper";
import EmojiButton from "@/components/ui/EmojiButton";

export default function TopBooks() {
  const { books } = useBookData();
  const currentYear = new Date().getFullYear();

  const fiveStarBooks = books
    .filter(
      (book) => book.rating === 5 && book.dateRead.getFullYear() === currentYear
    )
    .map((book) => book.coverUrl as string);

  return (
    <div className="page-container">
      <h4>Remember these?</h4>
      <BookCoverCarousel coverUrls={fiveStarBooks} />
      <h2>
        You <span className="text-secondary italic">really</span> loved them
      </h2>
      <Ratings rating={5} />
      <EmojiButton emoji="🥰" />
      <NavigationButtons />
    </div>
  );
}
