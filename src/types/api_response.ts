export interface GoogleBooksResponse {
  items?: Array<{
    volumeInfo?: {
      industryIdentifiers?: Array<{
        type: string;
        identifier: string;
      }>;
      imageLinks?: {
        thumbnail?: string;
      };
      title?: string;
      authors?: string[];
    };
  }>;
}
