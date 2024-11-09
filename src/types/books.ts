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

// export interface BookAnalytics {
//   ratingCounts: {
//     [rating: number]: number;
//   };
//   topRatedBooks?: Book[];
//   totalBooks: number;
//   totalPages: number;
//   topGenre?: string;
//   topGenreBooks?: Book[];
//   totalBooksPrevious: number;
//   booksRead: Book[];
// }

export interface BookDataContextType {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  processBooks: (rawBooks: RawBook[]) => void;
}
