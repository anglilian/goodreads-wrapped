"use client";
import { useBookData } from "@/hooks/useBookData";
import NavigationButtons from "@/components/ui/NavigationWrapper";
import Ratings from "@/components/top-books/Ratings";
import EmojiButton from "@/components/ui/EmojiButton";

export default function BookRating() {
  const { books } = useBookData();
  const currentYear = new Date().getFullYear();
  const thisYearBooks = books.filter(
    (book) => book.dateRead?.getFullYear() === currentYear && book.rating
  );

  const averageRating =
    thisYearBooks.length > 0
      ? thisYearBooks.reduce((sum, book) => sum + (book.rating || 0), 0) /
        thisYearBooks.length
      : 0;

  // Determine message based on rating distribution
  const getRatingMessage = () => {
    if (averageRating >= 4) {
      return <span className="text-secondary italic">loved</span>;
    } else if (averageRating >= 3) {
      return <span className="text-secondary italic">mostly enjoyed</span>;
    } else {
      return (
        <span className="text-secondary italic">had mixed feelings about</span>
      );
    }
  };

  // Count books by rating
  const ratingCounts = {
    1: thisYearBooks.filter((book) => book.rating === 1).length,
    2: thisYearBooks.filter((book) => book.rating === 2).length,
    3: thisYearBooks.filter((book) => book.rating === 3).length,
    4: thisYearBooks.filter((book) => book.rating === 4).length,
    5: thisYearBooks.filter((book) => book.rating === 5).length,
  };

  // Calculate max height for scaling bars (in pixels)
  const maxCount = Math.max(...Object.values(ratingCounts));
  const maxHeight = 200;
  const getBarHeight = (count: number) => (count / maxCount) * maxHeight;

  // Helper function to get rating count
  const getRatingCount = (rating: number) =>
    ratingCounts[rating as keyof typeof ratingCounts];

  return (
    <div className="page-container">
      <h2 className="text-center">You {getRatingMessage()} what you read</h2>

      {/* Rating bars container */}
      <div className="flex justify-center items-end gap-2 w-full max-w-xl mt-4">
        {[1, 2, 3, 4, 5].map((rating) => {
          const count = getRatingCount(rating);
          return (
            <div
              key={rating}
              className="flex-1 flex flex-col items-center gap-y-2"
            >
              <div
                className="w-full bg-secondary-button rounded-t-lg transition-all duration-500"
                style={{ height: `${getBarHeight(count)}px` }}
              >
                {count > 0 && (
                  <div className="text-center -mt-6 text-md md:text-lg text-secondary-button">
                    {count}
                    {count <= 1 ? " book" : " books"}
                  </div>
                )}
              </div>
              {/* Rating stars */}
              <div className="flex flex-row gap-1 text-center text-xl">
                {rating} <Ratings rating={1} />
              </div>
            </div>
          );
        })}
      </div>

      {averageRating >= 4 && (
        <h4 className="text-center">You sure know how to pick them!</h4>
      )}

      {/* Added Emoji Button */}
      <EmojiButton emoji="💪" />

      <NavigationButtons />
    </div>
  );
}
