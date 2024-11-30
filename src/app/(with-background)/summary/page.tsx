"use client";
import React, { useEffect, useState } from "react";
import { useBookData } from "@/hooks/useBookData";
import { useRouter } from "next/navigation";
import { Home, RotateCcw, Share2 } from "lucide-react";
import NavigationButtons from "@/components/ui/NavigationWrapper";
import Confetti from "react-confetti";
import ShareModal from "@/components/summary/ShareModal";

export default function Summary() {
  const { books, genreAnalysis, sharedBy, clearBooks } = useBookData();
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  const currentYear = new Date().getFullYear();

  // Derived state calculations
  const thisYearBooks = books.filter(
    (book) => book.dateRead.getFullYear() === currentYear
  );

  const totalPages = thisYearBooks.reduce(
    (sum, book) => sum + (book.numPages ?? 0), // Using nullish coalescing
    0
  );

  // Event handlers
  const handleReplay = () => router.push("/start");

  const handleTryYourself = () => {
    clearBooks();
    router.push("/");
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-container">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
        />
      )}

      <div className="flex flex-col gap-4 items-center justify-center text-center bg-background p-8 rounded-md">
        <header className="text-center space-y-2">
          <h3>{sharedBy ? `${sharedBy}'s` : "That's a wrap for"}</h3>
          <h1>{currentYear}</h1>
        </header>

        {/* Stats Grid */}
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-8 w-full">
            <StatsCard value={thisYearBooks.length} label="books" />
            <StatsCard value={totalPages.toLocaleString()} label="pages" />
          </div>

          {genreAnalysis?.genre && (
            <StatsCard value={genreAnalysis.genre} label="top genre" />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {sharedBy ? (
            <ActionButton
              onClick={handleTryYourself}
              icon={<Home />}
              label="Try it yourself!"
            />
          ) : (
            <ActionButton
              onClick={() => setShowShareModal(true)}
              icon={<Share2 />}
              label="Share"
            />
          )}
          <ActionButton
            onClick={handleReplay}
            icon={<RotateCcw />}
            label="Play again"
          />
        </div>
      </div>

      <NavigationButtons />
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}

// Helper Components
const StatsCard = ({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) => (
  <div className="text-center space-y-2 bg-secondary-button bg-opacity-40 rounded-lg p-4">
    <h2 className="text-secondary">{value}</h2>
    <h5>{label}</h5>
  </div>
);

const ActionButton = ({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={onClick}
    className="btn-primary inline-flex items-center gap-2"
  >
    {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
    {label}
  </button>
);
