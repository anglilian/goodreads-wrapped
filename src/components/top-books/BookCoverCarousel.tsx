import React from "react";

interface BookCoverCarouselProps {
  coverUrls: string[];
}

const BookCoverCarousel = ({ coverUrls }: BookCoverCarouselProps) => {
  // If 2 or fewer covers, show static view
  if (coverUrls.length <= 2) {
    return (
      <div className="flex justify-center gap-4 p-4">
        {coverUrls.map((url, index) => (
          <div key={index} className="flex-shrink-0">
            <img
              src={url}
              alt="Book cover"
              className="h-48 w-32 object-cover rounded-md shadow-md"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    );
  }

  const duplicatedBooks = [...coverUrls, ...coverUrls];

  // Calculate animation duration based on number of books
  // Base duration of 10s for 3 books, add 2s for each additional book
  const getAnimationDuration = () => {
    const baseDuration = 10;
    const durationPerBook = 2;
    const duration = baseDuration + (coverUrls.length - 3) * durationPerBook;
    return `${duration}s`;
  };

  return (
    <div className="relative overflow-hidden w-full max-auto max-w-96">
      {/* Left fade overlay */}
      <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-r from-background to-transparent z-10" />

      <div
        className="horizontal-scroll"
        style={{
          animationDuration: getAnimationDuration(),
        }}
      >
        {duplicatedBooks.map((url, index) => (
          <div key={`${url}-${index}`} className="flex-shrink-0">
            <img
              src={url}
              alt="Book cover"
              className="h-52 w-36 object-cover rounded-md shadow-md"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Right fade overlay */}
      <div className="absolute right-0 top-0 h-full w-2 bg-gradient-to-l from-background to-transparent z-10" />
    </div>
  );
};

export default BookCoverCarousel;
