import { useState, useEffect } from 'react';

interface FadingAuthorNamesProps {
  authors: string[];
  duration?: number; // Time each name is shown (ms)
}

export default function FadingAuthorNames({ authors, duration = 2000 }: FadingAuthorNamesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (authors.length <= 1) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % authors.length);
        setIsVisible(true);
      }, 300); // Fade transition time
    }, duration);

    return () => clearInterval(interval);
  }, [authors, duration]);

  if (authors.length === 0) return null;

  return (
    <h3 className={`text-secondary italic transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {authors[currentIndex]}
    </h3>
  );
}
