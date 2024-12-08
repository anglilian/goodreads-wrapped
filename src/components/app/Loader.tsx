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
    "Fun fact: The first Goodreads review was posted in 2007!",
    "Fun fact: The word &apos;bookworm&apos; has been around since 1580!",
    "Fun fact: The dot over the letter &apos;i&apos; is called a tittle.",
    "Some people experience a &apos;book hangover&apos; after finishing an amazing read 🤕",
    "Processing your literary adventures...",
    "Organising your bookshelf...",
  ];

  useEffect(() => {
    if (customText) return; // Don't start interval if using custom text

    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingTexts.length);
      setTextIndex(randomIndex);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [customText, loadingTexts.length]);

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
