import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readingData } from "@/lib/schema";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, bookData } = body;

    if (!name || !bookData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const readingDataId = nanoid(10);
    await db.insert(readingData).values({
      id: readingDataId,
      name,
      books: bookData.books,
      genreAnalysis: bookData.genreAnalysis || null,
    });

    return NextResponse.json({ success: true, id: readingDataId });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save data" },
      { status: 500 }
    );
  }
}
