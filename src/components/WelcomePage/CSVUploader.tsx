"use client";

import { Upload } from "lucide-react";
import Papa from "papaparse";
import { Book, RawBook } from "@/types/books";
import { useBookData } from "@/hooks/useBookData";
import { useState } from "react";

export default function CSVUploader() {
  const { handleBooks } = useBookData();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setError(null);

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        // Type check for fields array
        if (!results.meta?.fields) {
          setError("CSV file appears to be empty or invalid");
          return;
        }

        // Validate required columns
        const requiredCols = [
          "ISBN",
          "My Rating",
          "Title",
          "Author",
          "Number of Pages",
          "Date Read",
        ];
        const missingCols = requiredCols.filter(
          (col) => !results.meta.fields?.includes(col)
        );

        if (missingCols.length > 0) {
          setError(`Missing required columns: ${missingCols.join(", ")}`);
          return;
        }

        // Parse was successful, pass the data to handleBooks
        handleBooks(results.data as RawBook[]);
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
      },
    });
  };

  return (
    <div className="space-y-4 lg:max-w-96">
      <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-button transition-colors">
        <Upload className="w-8 h-8 text-gray-400" />
        <span className="text-sm text-gray-600">
          Click to upload CSV from Goodreads
        </span>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {error && (
        <div className="p-4 mt-4 text-red-800 bg-red-50 border border-red-200 rounded-lg">
          <p>{error}</p>
          {error.includes("Missing required columns") && (
            <div className="mt-2">
              <a
                href="https://help.goodreads.com/s/article/How-do-I-import-or-export-my-books-1553870934590"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-800 underline hover:text-red-900"
              >
                Need help?
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
