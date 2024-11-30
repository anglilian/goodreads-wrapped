export interface RawBook {
  ISBN: string;
  "My Rating"?: string;
  Title: string;
  Author: string;
  "Number of Pages"?: string;
  "Date Read": string;
  "Exclusive Shelf": string;
}

export interface Book {
  isbn: string;
  rating?: number;
  title: string;
  author: string;
  numPages?: number;
  dateRead: Date;
  coverUrl?: string;
}

export interface BookDataContextType {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  processBooks: (rawBooks: RawBook[]) => Promise<void>;
  setProcessedBooks: (books: Book[]) => void;
  clearBooks: () => void;
  genreAnalysis: {
    genre: string;
    isbns: string[];
  } | null;
  setGenreAnalysis: (
    analysis: { genre: string; isbns: string[] } | null
  ) => void;
  loadSharedData: (readerId: string) => Promise<void>;
  sharedBy: string | null;
}
