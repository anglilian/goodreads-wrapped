"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function StartPage() {
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const handleStart = async () => {
    await router.push("/books-read");
  };

  const handleBackToHome = async () => {
    await router.push("/");
  };

  return (
    <div className="relative min-h-screen">
      {/* Content container */}
      <div className="absolute inset-0 bg-background bg-opacity-90 flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center text-center gap-1">
          <h3>Your</h3>
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
      </div>
    </div>
  );
}
