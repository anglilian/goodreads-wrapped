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
  rating?: number; // Converted from string to number
  title: string;
  author: string;
  numPages?: number; // Converted from string to number
  dateRead: Date; // Converted from string to Date
  coverUrl?: string; // Added by useFetchBookCoverUrl
}

export interface BookAnalytics {
  ratingCounts: {
    [rating: number]: number;
  };
  topRatedBooks?: Book[];
  totalBooks: number;
  totalPages: number;
  topGenre?: string;
  topGenreBooks?: Book[];
}
