import React from "react";
import { Book } from "@/types/books";

interface BookStackProps {
  books: Book[];
  maxPages: number;
}

export default function BookStack({ books, maxPages }: BookStackProps) {
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 0;
  const maxStackHeight = viewportHeight * 0.3;

  const calculateBookHeight = (pages: number) => {
    return (pages / maxPages) * maxStackHeight;
  };

  const totalStackHeight = books.reduce(
    (sum, book) => sum + calculateBookHeight(book.numPages || 0),
    0
  );

  const colors = [
    "#E43C25", // Red
    "#8F4D97", // Purple
    "#FDBA13", // Yellow
    "#33479D", // Blue
  ];

  const borderColors = colors.map(() => "rgba(0,0,0,0.15)");

  const generateBookStyle = (
    index: number,
    pages: number
  ): React.CSSProperties => {
    const offsetX = (Math.random() - 0.5) * 6;
    const width = 100 + Math.random() * 6;
    const borderWidth = width * 0.025;
    const rotation = (Math.random() - 0.5) * 1.5;
    const bottomOffset = books
      .slice(0, index)
      .reduce((acc, book) => acc + calculateBookHeight(book.numPages || 0), 0);

    return {
      height: `${calculateBookHeight(pages)}px`,
      width: `${width}%`,
      backgroundColor: colors[index % colors.length],
      borderLeft: `${borderWidth}px solid ${
        borderColors[index % borderColors.length]
      }`,
      borderRight: `${borderWidth}px solid ${
        borderColors[index % borderColors.length]
      }`,
      boxShadow: "2px 2px 4px rgba(0,0,0,0.1)",
      position: "absolute",
      bottom: `${bottomOffset}px`,
      transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
      borderRadius: "4px",
    };
  };

  return (
    <div
      className="relative w-32"
      style={{
        height: `${totalStackHeight}px`,
        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))",
      }}
    >
      {books.map((book, index) => (
        <div
          key={index}
          className="book transition-transform duration-200 hover:translate-x-2 relative"
          style={generateBookStyle(index, book.numPages || 0)}
        >
          {/* Top and bottom decorative bands */}
          <div className="absolute top-[15%] left-[10%] right-[10%] h-[2px] bg-white/30" />
          <div className="absolute bottom-[15%] left-[10%] right-[10%] h-[2px] bg-white/30" />

          {/* Small circles or dots for additional detail */}
          <div className="absolute bottom-[40%] left-[30%] w-[4px] h-[4px] rounded-full bg-white/30" />
          <div className="absolute bottom-[40%] right-[30%] w-[4px] h-[4px] rounded-full bg-white/30" />
        </div>
      ))}
    </div>
  );
}
