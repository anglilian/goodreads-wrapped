import { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BookDataContext } from "@/context/BookDataContext";
import { BookDataContextType } from "@/types/books";

export function useBookData(): BookDataContextType {
  const context = useContext(BookDataContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip redirect for these paths
    const allowedPaths = ["/"];
    if (
      !context ||
      (!context.books.length && !allowedPaths.includes(pathname))
    ) {
      router.push("/");
    }
  }, [context, pathname, router]);

  if (!context) {
    throw new Error("useBookData must be used within a BookDataProvider");
  }

  return context;
}
