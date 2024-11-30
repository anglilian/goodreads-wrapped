export function parseGenreResponse(response: string): {
  genre: string;
  isbns: string[];
} {
  console.log("Raw response to parse:", response);
  try {
    const lines = response.split("\n").filter((line) => line.trim());
    console.log("Split lines:", lines);

    // Get genre from the first line, removing "you read a lot about" if present
    const genre = lines[0]
      .replace(/You read a lot about/i, "")
      .trim()
      .replace(/[.,!?]$/, "");
    console.log("Extracted genre:", genre);

    // Get ISBNs from remaining lines
    const isbns = lines.slice(1).map((line) => line.trim());
    console.log("Extracted ISBNs:", isbns);

    return { genre, isbns };
  } catch (error) {
    console.error("Error parsing response:", error);
    throw new Error(
      `Failed to parse API response: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
