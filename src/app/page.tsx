"use client";

import { ExternalLink } from "lucide-react";
import CSVUploader from "@/components/WelcomePage/CSVUploader";
import Loader from "@/components/WelcomePage/Loader";
import { useBookData } from "@/hooks/useBookData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Footer from "@/components/ui/Footer";

export default function WelcomePage() {
  const currentYear = new Date().getFullYear();
  const { books, isLoading } = useBookData();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && books.length > 0) {
      router.push("/start");
    }
  }, [books.length, isLoading, router]);

  return (
    <main className="h-screen bg-background flex flex-col p-4 overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center min-h-fit gap-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1>{currentYear}</h1>
          <h3>Goodreads Wrapped</h3>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="space-y-6 text-center">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col sm:grid sm:grid-cols-[100px_1fr] gap-2 sm:gap-x-3">
                <p className="font-bold text-center sm:text-right">Step 1:</p>
                <div className="flex flex-col items-center sm:items-start gap-2">
                  <div className="flex flex-col items-center gap-1">
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
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-[100px_1fr] gap-2 sm:gap-x-3">
                <p className="font-bold text-center sm:text-right">Step 2:</p>
                <CSVUploader></CSVUploader>
              </div>
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
