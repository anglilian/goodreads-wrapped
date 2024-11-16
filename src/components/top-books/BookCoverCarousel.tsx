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

  return (
    <div className="relative overflow-hidden w-96">
      <div className="horizontal-scroll gap-4">
        {duplicatedBooks.map((url, index) => (
          <div key={index} className="flex-shrink-0">
            <img
              src={url}
              alt="Book cover"
              className="h-52 w-36 object-cover rounded-md shadow-md"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookCoverCarousel;
