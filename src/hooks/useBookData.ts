import { useContext } from "react";
import { BookDataContext } from "@/context/BookDataContext";
import { BookDataContextType } from "@/types/books";

export function useBookData(): BookDataContextType {
  const context = useContext(BookDataContext);
  if (!context) {
    throw new Error("useBookData must be used within a BookDataProvider");
  }
  return context;
}
