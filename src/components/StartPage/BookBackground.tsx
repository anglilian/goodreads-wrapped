import React from "react";

interface BookBackgroundProps {
  coverUrls: string[];
}

const COLUMN_OFFSETS = [0, -70, -30] as const;

const BookBackground = ({ coverUrls }: BookBackgroundProps) => {
  const getColumnBooks = (columnIndex: number) => {
    if (coverUrls.length <= 3) return coverUrls;

    const columnSize = Math.ceil(coverUrls.length / 3);
    return coverUrls.slice(
      columnSize * columnIndex,
      columnSize * (columnIndex + 1)
    );
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-3 w-full h-full gap-2">
          {COLUMN_OFFSETS.map((offset, index) => (
            <div key={index} className="relative overflow-hidden">
              <div
                className="infinite-scroll grid grid-cols-1 gap-2"
                style={{ marginTop: `${offset}%` }}
              >
                {getColumnBooks(index).map((coverUrl, imgIndex) => (
                  <div key={imgIndex} className="aspect-[2/3] p-1">
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
    </div>
  );
};

export default BookBackground;
