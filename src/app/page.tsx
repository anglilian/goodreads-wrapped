import { ExternalLink } from "lucide-react";
import CSVUploader from "@/components/WelcomePage/CSVUploader";

export default function WelcomePage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="h-screen bg-background flex flex-col p-4 overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center min-h-fit">
        <div className="text-center space-y-2 mb-8">
          <h1>{currentYear}</h1>
          <h3>Goodreads Wrapped</h3>
        </div>

        <div className="space-y-6 text-center">
          <div>
            <div className="flex flex-row items-center gap-3">
              <p className="font-bold">Step 1:</p>
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
            </div>

            <a
              href="https://help.goodreads.com/s/article/How-do-I-import-or-export-my-books-1553870934590"
              target="_blank"
              rel="noopener noreferrer"
            >
              Need help?
            </a>
          </div>

          <div className="flex flex-row gap-3">
            <p className="font-bold">Step 2:</p>
            <CSVUploader></CSVUploader>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <img
          src="/images/book-outline.svg"
          alt="Book outline"
          className="w-48 md:w-64 lg:w-1/4 h-auto"
        />
      </div>
    </main>
  );
}
