import React from "react";
import { Star } from "lucide-react";

interface RatingsProps {
  rating?: number;
}

const Ratings: React.FC<RatingsProps> = ({ rating = 0 }) => {
  return (
    <div className="flex items-center justify-center gap-1 w-full">
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          className={`${
            index <= rating ? "fill-[#E87402] text-[#E87402]" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default Ratings;
