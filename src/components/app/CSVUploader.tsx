"use client";

import { Upload } from "lucide-react";
import Papa from "papaparse";
import { RawBook } from "@/types/books";
import { useBookData } from "@/hooks/useBookData";
import { useState } from "react";

export default function CSVUploader() {
  const { processBooks, error: contextError } = useBookData();
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Extract file processing logic to be reused by both click and drag-drop
  const processFile = (file: File) => {
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
        setError(`Error parsing CSV: ${error.message}. Please try again.`);
      },
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const displayError = error || contextError;

  return (
    <div className="space-y-4 lg:max-w-80">
      <label 
        className={`flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragging 
            ? 'border-primary-button bg-blue-50' 
            : 'border-gray-300 hover:border-primary-button'
          }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className={`w-8 h-8 ${isDragging ? 'text-primary-button' : 'text-gray-400'}`} />
        <span className={`text-sm ${isDragging ? 'text-primary-button' : 'text-gray-600'}`}>
          {isDragging ? 'Drop your CSV file here' : 'Click or drag CSV from Goodreads'}
        </span>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {displayError && (
        <div className="p-4 mt-4 text-red-800 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm">{displayError}</p>
        </div>
      )}
    </div>
  );
}
