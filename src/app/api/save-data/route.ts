import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readingData } from "@/lib/schema";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const { name, bookData = {} } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const [readingDataId] = await Promise.all([
      Promise.resolve(nanoid(10)),
      db.insert(readingData).values({
        id: nanoid(10),
        name,
        books: bookData.books || [],
        genreAnalysis: bookData.genreAnalysis || null,
      }),
    ]);

    return NextResponse.json({ success: true, id: readingDataId });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save data" },
      { status: 500 }
    );
  }
}
