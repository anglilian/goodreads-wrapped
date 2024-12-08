"use client";

import { ExternalLink, HelpCircle } from "lucide-react";
import CSVUploader from "@/components/app/CSVUploader";
import Loader from "@/components/app/Loader";
import { useBookData } from "@/hooks/useBookData";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { mockBooks, mockGenreAnalysis } from "@/tests/testData";
import HelpModal from "@/components/app/HelpModal";

function WelcomePageContent() {
  const currentYear = new Date().getFullYear();
  const {
    books,
    isLoading,
    error,
    setProcessedBooks,
    loadSharedData,
    setGenreAnalysis,
    clearBooks,
  } = useBookData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const readerId = searchParams.get("id");
  const [showHelpPopup, setShowHelpPopup] = useState(false);

  useEffect(() => {
    if (!readerId) return;

    clearBooks();
    loadSharedData(readerId).catch((error) => {
      console.error("Failed to load shared data:", error);
      router.push("/");
    });
  }, [readerId, clearBooks, loadSharedData, router]);

  const shouldShowLoader = isLoading || (readerId && books.length === 0);

  const handleUseDemoData = () => {
    setProcessedBooks(mockBooks);
    setGenreAnalysis(mockGenreAnalysis);
  };

  return (
    <main>
      <div className="flex-1 flex flex-col items-center justify-center min-h-[100dvh] gap-y-2">
        <div className="text-center space-y-2 mb-8">
          <h1>{currentYear}</h1>
          <h3>Goodreads Wrapped</h3>
        </div>

        {shouldShowLoader ? (
          <Loader />
        ) : (
          <div className="text-center">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 ">
                <p className="font-bold text-center ">Step 1</p>
                <div className="flex flex-col items-center gap-2">
                  <a
                    href="https://www.goodreads.com/review/import"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="btn-primary inline-flex items-center gap-2">
                      Export Goodreads library
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </a>
                  <button
                    onClick={() => setShowHelpPopup(true)}
                    className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Need help?
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2 ">
                <p className="font-bold text-center">Step 2</p>
                <CSVUploader />
                <button onClick={handleUseDemoData} className="btn-secondary">
                  Use demo data
                </button>
              </div>
              <div></div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex justify-center">
        <div className="relative w-48 md:w-64 lg:w-1/4 aspect-video">
          <Image
            src="/images/book-outline.svg"
            alt="Book outline"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 12rem, (max-width: 1024px) 16rem, 25vw"
          />
        </div>
      </div>

      <HelpModal
        isOpen={showHelpPopup}
        onClose={() => setShowHelpPopup(false)}
      />
    </main>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<Loader />}>
      <WelcomePageContent />
    </Suspense>
  );
}
