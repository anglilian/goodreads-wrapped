// src/app/page.tsx
import { ExternalLink } from "lucide-react";

export default function WelcomePage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="h-screen bg-background flex flex-col p-4 overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center min-h-fit">
        {/* Title section with proper spacing */}
        <div className="text-center space-y-2 mb-8">
          <h1>{currentYear}</h1>
          <h3>Goodreads Wrapped</h3>
        </div>

        {/* Steps section with consistent spacing */}
        <div className="space-y-6 text-center">
          {/* Step 1 */}
          <div className="space-y-4">
            <p>
              <span className="font-bold">Step 1</span>: Export your Goodreads
              library
            </p>

            <div className="flex flex-col items-center gap-3">
              <a
                href="https://www.goodreads.com/review/import"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="btn-primary inline-flex items-center gap-2">
                  Export library
                  <ExternalLink className="w-4 h-4" />
                </button>
              </a>

              <a
                href="https://help.goodreads.com/s/article/How-do-I-import-or-export-my-books-1553870934590"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-button hover:underline"
              >
                Need help?
              </a>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-4">
            <p>
              <span className="font-bold">Step 2</span>: Upload your CSV file to
              get started
            </p>

            <button className="btn-primary">Upload CSV</button>
          </div>
        </div>
      </div>

      {/* Book image with controlled width */}
      <div className="w-full flex justify-center">
        <img
          src="/images/book-outline.svg"
          alt="Book outline"
          className="w-48 md:w-64 lg:w-1/4 h-auto" // Adjust the width (200px) as needed
        />
      </div>
    </main>
  );
}
