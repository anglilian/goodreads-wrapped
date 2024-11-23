"use client";

import { ExternalLink } from "lucide-react";
import CSVUploader from "@/components/app/CSVUploader";
import Loader from "@/components/app/Loader";
import { useBookData } from "@/hooks/useBookData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { mockBooks } from "@/tests/testData";

export default function WelcomePage() {
  const currentYear = new Date().getFullYear();
  const { books, isLoading, setProcessedBooks } = useBookData();
  const router = useRouter();

  const handleUseDemoData = () => {
    setProcessedBooks(mockBooks);
  };

  useEffect(() => {
    if (!isLoading && books.length > 0) {
      router.push("/start");
    }
  }, [books.length, isLoading, router]);

  return (
    <main>
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen gap-y-2">
        <div className="text-center space-y-2 mb-8">
          <h1>{currentYear}</h1>
          <h3>Goodreads Wrapped</h3>
        </div>

        {isLoading ? (
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
                  <a
                    href="https://help.goodreads.com/s/article/How-do-I-import-or-export-my-books-1553870934590#:~:text=To%20Export%20your%20books%20to%20a%20.csv%20file"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Need help?
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-2 ">
                <p className="font-bold text-center">Step 2</p>
                <CSVUploader />
                <button onClick={handleUseDemoData} className="btn-primary">
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
    </main>
  );
}
