import React from "react";

interface BookBackgroundProps {
  coverUrls: string[];
}

const BookBackground = ({ coverUrls }: BookBackgroundProps) => {
  const numColumns = 3;

  const getColumnBooks = (columnIndex: number) => {
    // Ensure even distribution by taking every nth item where n is numColumns
    return coverUrls.filter((_, i) => i % numColumns === columnIndex);
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden flex justify-center p-2">
      <div className="max-w-2xl flex gap-4 h-full">
        {Array.from({ length: numColumns }, (_, index) => (
          <div key={index} className="column">
            <div
              className="vertical-scroll"
              style={{
                willChange: "transform",
                backfaceVisibility: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                transform: "translateZ(0)", // Force GPU acceleration
              }}
            >
              {/* Original set of books */}
              {getColumnBooks(index).map((coverUrl, imgIndex) => (
                <div key={imgIndex} className="aspect-[2/3]">
                  <img
                    src={coverUrl}
                    alt="Book cover"
                    className="w-full h-full object-cover rounded-md shadow-md"
                    loading="lazy"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless scrolling */}
              {getColumnBooks(index).map((coverUrl, imgIndex) => (
                <div key={`duplicate-${imgIndex}`} className="aspect-[2/3]">
                  <img
                    src={coverUrl}
                    alt="Book cover"
                    className="w-full h-full object-cover rounded-md shadow-md"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookBackground;
