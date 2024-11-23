import React from "react";

interface BookBackgroundProps {
  coverUrls: string[];
}

const BookBackground = ({ coverUrls }: BookBackgroundProps) => {
  const numColumns = 3;

  const getColumnBooks = (columnIndex: number) => {
    // Distribute books evenly across columns using modulo
    return coverUrls.filter((_, i) => i % numColumns === columnIndex);
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden flex justify-center p-2">
      <div className="w-full max-w-2xl grid grid-cols-3 gap-4 h-full">
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
              }}
            >
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
