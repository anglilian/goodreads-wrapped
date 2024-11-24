import React from "react";

interface BookBackgroundProps {
  coverUrls: string[];
}

const BookBackground = ({ coverUrls }: BookBackgroundProps) => {
  const numColumns = 3;
  const minBooksPerColumn = 3;
  const minTotalBooks = numColumns * minBooksPerColumn;

  // Calculate animation duration based on number of books
  const getAnimationDuration = () => {
    const booksPerColumn = Math.ceil(coverUrls.length / numColumns);
    // Base duration of 20s for minimum books, add 5s for each additional book
    const duration = Math.max(
      20,
      20 + (booksPerColumn - minBooksPerColumn) * 1
    );
    return `${duration}s`;
  };

  // If we don't have enough books for a good scrolling effect, show static grid
  if (coverUrls.length < minTotalBooks) {
    // Create an array of 12 items (3x4 grid) by repeating the coverUrls as needed
    const repeatedCovers = Array.from(
      { length: 12 },
      (_, i) => coverUrls[i % coverUrls.length]
    );

    return (
      <div className="fixed inset-0 -z-10 overflow-hidden flex justify-center">
        <div className="w-full max-w-2xl">
          <div
            className="grid grid-cols-3 gap-4 auto-rows-max mx-auto"
            style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
          >
            {repeatedCovers.map((coverUrl, index) => (
              <div key={index} className="aspect-[2/3] w-full">
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
      </div>
    );
  }

  // Add this function to get books for each column with equal lengths
  const getColumnBooks = (columnIndex: number) => {
    const columnBooks = coverUrls.filter(
      (_, i) => i % numColumns === columnIndex
    );
    // Find the maximum length among all columns
    const maxLength = Math.max(
      ...Array.from(
        { length: numColumns },
        (_, i) => coverUrls.filter((_, j) => j % numColumns === i).length
      )
    );

    // Pad shorter columns by repeating books
    while (columnBooks.length < maxLength) {
      columnBooks.push(...columnBooks.slice(0, maxLength - columnBooks.length));
    }

    let duplicatedColumnBooks = [...columnBooks, ...columnBooks];

    return duplicatedColumnBooks;
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
                transform: "translateZ(0)",
                animationDuration: getAnimationDuration(),
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookBackground;
