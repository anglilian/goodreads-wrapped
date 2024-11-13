"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes } from "react";

interface NavigationButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "previous" | "next";
  href: string;
}

export default function NavigationButton({
  direction,
  href,
  className = "",
  ...props
}: NavigationButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center justify-center
        w-12 h-12
        rounded-full
        bg-secondary-button
        text-primary-text
        transition-all duration-200
        hover:scale-110
        focus:outline-none focus:ring-2 focus:ring-primary-button focus:ring-offset-2
        ${direction === "previous" ? "lg:mr-auto" : "lg:ml-auto"}
      `}
      aria-label={`${direction} page`}
      {...props}
    >
      {direction === "previous" ? (
        <ChevronLeft className="w-6 h-6" />
      ) : (
        <ChevronRight className="w-6 h-6" />
      )}
    </button>
  );
}
