"use client";
import React from "react";
import { useBookData } from "@/hooks/useBookData";

export default function StartPage() {
  const { books, isLoading } = useBookData();
  const currentYear = new Date().getFullYear();

  const thisYearBooks = books.filter(
    (book) => book.dateRead.getFullYear() === currentYear
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">
        Processed Book Data ({thisYearBooks.length} books)
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Date Read</th>
              <th className="border p-2 text-left">ISBN</th>
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Author</th>
              <th className="border p-2 text-left">Rating</th>
              <th className="border p-2 text-left">Pages</th>
              <th className="border p-2 text-left">Cover URL</th>
            </tr>
          </thead>
          <tbody>
            {thisYearBooks.map((book, index) => (
              <tr key={index} className="border hover:bg-gray-50">
                <td className="border p-2">
                  {book.dateRead.toLocaleDateString()}
                </td>
                <td className="border p-2">{book.isbn || "-"}</td>
                <td className="border p-2">{book.title}</td>
                <td className="border p-2">{book.author}</td>
                <td className="border p-2">{book.rating || "-"}</td>
                <td className="border p-2">{book.numPages || "-"}</td>
                <td className="border p-2">
                  {book.coverUrl ? (
                    <a
                      href={book.coverUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {book.coverUrl}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
