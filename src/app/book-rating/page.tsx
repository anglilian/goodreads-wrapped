"use client";
import { useBookData } from "@/hooks/useBookData";
import NavigationButtons from "@/components/ui/NavigationWrapper";
import Ratings from "@/components/top-books/Ratings";

export default function BookRating() {
  const { books } = useBookData();
  const currentYear = new Date().getFullYear();

  const thisYearBooks = books.filter(
    (book) => book.dateRead.getFullYear() === currentYear
  );

  // Count books by rating
  const ratingCounts = {
    3: thisYearBooks.filter((book) => book.rating === 3).length,
    4: thisYearBooks.filter((book) => book.rating === 4).length,
    5: thisYearBooks.filter((book) => book.rating === 5).length,
  };

  // Calculate max height for scaling bars (in pixels)
  const maxCount = Math.max(...Object.values(ratingCounts));
  const maxHeight = 200;
  const getBarHeight = (count: number) => (count / maxCount) * maxHeight;

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen gap-y-[5vh] p-4">
      <div className="text-center">
        <h2>
          You <span className="text-secondary italic">loved</span> most of what
          you read
        </h2>
      </div>

      {/* Rating bars container */}
      <div className="flex justify-center items-end gap-[2vw] w-full max-w-xl">
        {[3, 4, 5].map((rating) => (
          <div
            key={rating}
            className="flex-1 flex flex-col items-center gap-y-2"
          >
            {/* Bar */}
            <div
              className="w-full bg-secondary-button rounded-t-lg transition-all duration-500"
              style={{
                height: `${getBarHeight(
                  ratingCounts[rating as keyof typeof ratingCounts]
                )}px`,
              }}
            >
              <div className="text-center -mt-6 text-md md:text-lg">
                {ratingCounts[rating as keyof typeof ratingCounts]} books
              </div>
            </div>
            {/* Rating stars */}
            <div className="mt-4 w-full">
              <Ratings rating={rating} />
            </div>
          </div>
        ))}
      </div>

      <h4 className="text-center">You sure know how to pick them!</h4>
      <NavigationButtons />
    </div>
  );
}
