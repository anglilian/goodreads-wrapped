"use client";

import { Upload } from "lucide-react";
import Papa from "papaparse";
import { RawBook } from "@/types/books";
import { useBookData } from "@/hooks/useBookData";
import { useState } from "react";

export default function CSVUploader() {
  const { processBooks, isLoading, error: contextError } = useBookData();
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
          setError(
            `Missing required columns: ${missingCols.join(
              ", "
            )}. Do not edit the CSV downloaded from Goodreads.`
          );
          return;
        }

        // Parse was successful, pass the data to handleBooks
        processBooks(results.data as RawBook[]);
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
      },
    });
  };

  return (
    <div className="space-y-4 lg:max-w-80">
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

      {(error || contextError) && (
        <div className="p-4 mt-4 text-red-800 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
