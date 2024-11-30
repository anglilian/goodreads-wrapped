import { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BookDataContext } from "@/context/BookDataContext";
import { BookDataContextType } from "@/types/books";

export function useBookData(): BookDataContextType {
  const context = useContext(BookDataContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!context) return;

    // Only redirect if we're not on the home page
    if (pathname !== "/" && !context.books.length && !context.isLoading) {
      router.push("/");
    }
    // Redirect to start if we have books and we're on home page
    else if (
      pathname === "/" &&
      context.books.length > 0 &&
      !context.isLoading
    ) {
      router.push("/start");
    }
  }, [context, pathname, router]);

  if (!context) {
    throw new Error("useBookData must be used within a BookDataProvider");
  }

  return context;
}
