import Image from "next/image";
import { useState, useEffect } from "react";

interface LoaderProps {
  customText?: string;
}

export default function Loader({ customText }: LoaderProps) {
  const [textIndex, setTextIndex] = useState(0);

  const loadingTexts = [
    "Looking through your library...",
    "Analysing your reading journey...",
    "Comparing your books with last year...",
    "Figuring out what books you liked...",
  ];

  useEffect(() => {
    if (customText) return; // Don't start interval if using custom text

    const intervalId = setInterval(() => {
      setTextIndex((prevIndex) =>
        prevIndex === loadingTexts.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [customText]);

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
        {customText || loadingTexts[textIndex]}
      </p>
    </div>
  );
}
