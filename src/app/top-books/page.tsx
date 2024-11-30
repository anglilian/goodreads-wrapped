"use client";
import { useBookData } from "@/hooks/useBookData";
import Ratings from "@/components/top-books/Ratings";
import BookCoverCarousel from "@/components/top-books/BookCoverCarousel";
import NavigationButtons from "@/components/ui/NavigationWrapper";
import EmojiButton from "@/components/ui/EmojiButton";
import { useRouter } from "next/router";

export default function TopBooks() {
  const { books, sharedBy } = useBookData();
  const currentYear = new Date().getFullYear();
  const booksThisYear = books.filter(
    (book) => book.dateRead.getFullYear() === currentYear
  );

  const fiveStarBooks = booksThisYear
    .filter((book) => book.rating === 5)
    .map((book) => ({
      coverUrl: book.coverUrl as string,
      title: book.title,
      author: book.author,
    }));

  if (fiveStarBooks.length > 0) {
    return (
      <div className="page-container">
        <h4>{sharedBy ? `Check these out!` : "Remember these?"}</h4>
        <BookCoverCarousel books={fiveStarBooks} />
        <h2>
          {sharedBy ? `${sharedBy} ` : "You "}
          <span className="text-secondary italic">really</span>{" "}
          {`loved ${fiveStarBooks.length === 1 ? "it" : "them"}`}
        </h2>
        <Ratings rating={5} />
        <EmojiButton emoji="🥰" />
        <NavigationButtons />
      </div>
    );
  }

  const fourStarBooks = booksThisYear
    .filter((book) => book.rating === 4)
    .map((book) => ({
      coverUrl: book.coverUrl as string,
      title: book.title,
      author: book.author,
    }));

  if (fourStarBooks.length > 0) {
    return (
      <div className="page-container">
        <h2>
          None made the <span className="text-secondary italic">5-star</span>{" "}
          list
        </h2>
        <BookCoverCarousel books={fourStarBooks} />
        <h4>
          But {fourStarBooks.length === 1 ? "this one came" : "these came"}{" "}
          close...
        </h4>
        <Ratings rating={4} />
        <EmojiButton emoji="🥰" />
        <NavigationButtons />
      </div>
    );
  }

  if (fourStarBooks.length === 0 && fiveStarBooks.length === 0) {
    const router = useRouter();
    router.push("/book-rating");
  }
}
