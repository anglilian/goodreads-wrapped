"use client";
import React from "react";
import { useRouter } from "next/navigation";
import NavigationButtons from "@/components/ui/NavigationWrapper";
import { useBookData } from "@/hooks/useBookData";

export default function StartPage() {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const { clearBooks, sharedBy } = useBookData();

  const handleStart = async () => {
    await router.push("/books-read");
  };

  const handleBackToHome = async () => {
    clearBooks();
    await router.push("/");
  };

  return (
    <div className="page-container bg-background/90">
      <div className="flex flex-col items-center justify-center text-center gap-1">
        <h3>{sharedBy ? `${sharedBy}&apos;s` : "Your"}</h3>
        <h1>{currentYear}</h1>
        <h3> in Books</h3>
      </div>

      <div className="flex flex-col gap-2">
        <button className="btn-primary" onClick={handleStart}>
          Start
        </button>
        <button
          className="text-sm text-secondary-button hover:text-secondary transition-colors"
          onClick={handleBackToHome}
        >
          Back to Home
        </button>
      </div>
      <NavigationButtons />
    </div>
  );
}
