"use client";
import { useBookData } from "@/hooks/useBookData";
import BookCoverCarousel from "@/components/top-books/BookCoverCarousel";
import NavigationButtons from "@/components/ui/NavigationWrapper";
import EmojiButton from "@/components/ui/EmojiButton";
import { redirect } from "next/navigation";
import { Book } from "@/types/books";
import FadingAuthorNames from "@/components/top-author/FadingAuthorNames";

export default function TopAuthor() {
  const { books, sharedBy } = useBookData();
  const currentYear = new Date().getFullYear();
  const booksThisYear = books.filter(
    (book) => book.dateRead.getFullYear() === currentYear
  );

  const groupByAuthor = booksThisYear
    .reduce((acc, book) => {
        if (!acc[book.author]) {
            acc[book.author] = [];
          }
          acc[book.author].push(book);
          return acc;
        }, {} as Record<string, Book[]>);

    const MIN_BOOK_COUNT = 2;

    const sortedAuthors = Object.entries(groupByAuthor).sort((a, b) => b[1].length - a[1].length);
    const maxBookCount = sortedAuthors[0][1].length;
    const filteredAuthors = sortedAuthors.filter((author) => author[1].length > MIN_BOOK_COUNT);

    const topAuthors = filteredAuthors.filter((author) => author[1].length === Math.max(MIN_BOOK_COUNT, maxBookCount));
    const topAuthorsName = topAuthors.map((author) => author[0]);
    const topAuthorsBooks = topAuthors.flatMap((author) => author[1]);

  if (topAuthors.length > 0) {
    return (
      <div className="page-container">
        <div className="space-y-2 text-center">
            <h3> {sharedBy ? `${sharedBy} read a lot of` : "You read a lot of"}</h3>
            <FadingAuthorNames authors={topAuthorsName} />
        </div>
        <BookCoverCarousel books={topAuthorsBooks.map((book) => ({
          coverUrl: book.coverUrl as string,
          title: book.title,
          author: book.author,
        }))} />
        {topAuthors.length > 1 ? (
          <h4><span className="text-secondary italic mr-1">{maxBookCount}</span> books from each to be exact!</h4>
        ) : (
          <h4><span className="text-secondary italic mr-1">{maxBookCount}</span> books to be exact!</h4>
        )}
        <EmojiButton emoji="😍" />
        <NavigationButtons />
      </div>
    );
  } else {
    redirect("/pages-read");
  }
}
