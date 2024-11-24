"use client";
import { useBookData } from "@/hooks/useBookData";
import Ratings from "@/components/top-books/Ratings";
import BookCoverCarousel from "@/components/top-books/BookCoverCarousel";
import NavigationButtons from "@/components/ui/NavigationWrapper";
import EmojiButton from "@/components/ui/EmojiButton";

export default function TopBooks() {
  const { books } = useBookData();
  const currentYear = new Date().getFullYear();
  const booksThisYear = books.filter(
    (book) => book.dateRead.getFullYear() === currentYear
  );

  const fiveStarBooks = booksThisYear
    .filter((book) => book.rating === 5)
    .map((book) => book.coverUrl as string);

  if (fiveStarBooks.length > 0) {
    return (
      <div className="page-container">
        <h2>
          <h4>Remember these?</h4>{" "}
        </h2>
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

  const fourStarBooks = booksThisYear
    .filter((book) => book.rating === 4)
    .map((book) => book.coverUrl as string);

  if (fourStarBooks.length > 0) {
    return (
      <div className="page-container">
        <h2>
          None made the <span className="text-secondary italic">5-star</span>{" "}
          list
        </h2>
        <BookCoverCarousel coverUrls={fourStarBooks} />
        <h4>But these came close...</h4>
        <Ratings rating={4} />
        <EmojiButton emoji="🥰" />
        <NavigationButtons />
      </div>
    );
  }
}
