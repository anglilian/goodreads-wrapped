import React from "react";

interface HorizontalCarouselProps {
  coverUrls: string[];
}

const HorizontalCarousel = ({ coverUrls }: HorizontalCarouselProps) => {
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

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-96">
        <div className="horizontal-scroll flex gap-4 p-4 -ml-20">
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
      </div>
    </div>
  );
};

export default HorizontalCarousel;
