"use client";
import { useBookData } from "@/hooks/useBookData";
import BookBackground from "@/components/ui/BookBackground";

export default function BackgroundContainer() {
  const { books } = useBookData();
  const currentYear = new Date().getFullYear();

  const coverUrls = books
    .filter(
      (book) => book.coverUrl && book.dateRead.getFullYear() === currentYear
    )
    .map((book) => book.coverUrl as string);

  return <BookBackground coverUrls={coverUrls} />;
}
