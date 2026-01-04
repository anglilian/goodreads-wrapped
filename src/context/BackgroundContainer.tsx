"use client";
import { useBookData } from "@/hooks/useBookData";
import BookBackground from "@/components/ui/BookBackground";

export default function BackgroundContainer() {
  const { books, goodreadsYear } = useBookData();

  const coverUrls = books
    .filter(
      (book) => book.coverUrl && book.dateRead.getFullYear() === goodreadsYear
    )
    .map((book) => book.coverUrl as string);

  return <BookBackground coverUrls={coverUrls} />;
}
