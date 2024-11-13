"use client";
import { useBookData } from "@/hooks/useBookData";

export default function TopBooks() {
  const { books, previousYearBookCount } = useBookData();

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-fit gap-y-6">
      <h4>Remember these?</h4>
      <h2>
        You <span className="text-secondary italic">really</span> loved them
      </h2>
    </div>
  );
}
