import Image from "next/image";
import { useState, useEffect } from "react";

export default function Loader() {
  const [textIndex, setTextIndex] = useState(0);

  const loadingTexts = [
    "Looking through your library...",
    "Analysing your reading journey...",
    "Comparing your books with last year...",
    "Figuring out what books you liked...",
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTextIndex((prevIndex) =>
        prevIndex === loadingTexts.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <Image
        src="/images/flipping_book.gif"
        width={48}
        height={48}
        alt="Loading animation"
        priority
      />
      <p className="transition-opacity duration-500">
        {loadingTexts[textIndex]}
      </p>
    </div>
  );
}
