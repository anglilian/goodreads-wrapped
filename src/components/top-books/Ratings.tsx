import React from "react";
import { Star } from "lucide-react";

interface RatingsProps {
  rating?: number;
}

export const STAR_SIZE = 24;

const Ratings: React.FC<RatingsProps> = ({ rating = 0 }) => {
  return (
    <div className="flex items-center justify-center gap-[0.25em] w-full">
      {Array.from({ length: rating || 0 }).map((_, index) => (
        <Star
          key={index}
          className="fill-[#E87402] text-[#E87402] w-[min(24px,4.5vw)] h-[min(24px,4.5vw)]"
        />
      ))}
    </div>
  );
};

export default Ratings;
