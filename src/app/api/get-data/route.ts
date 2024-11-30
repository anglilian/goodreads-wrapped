import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readingData } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    // Add connection test
    try {
      await db.execute(sql`SELECT 1`);
      console.log("Database connection successful");
    } catch (e) {
      console.error("Database connection failed:", e);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const readerId = searchParams.get("id");

    if (!readerId) {
      return NextResponse.json(
        { error: "Reader ID is required" },
        { status: 400 }
      );
    }

    const data = await db
      .select({
        books: readingData.books,
        genreAnalysis: readingData.genreAnalysis,
        userName: readingData.name,
      })
      .from(readingData)
      .where(eq(readingData.id, readerId))
      .limit(1);

    if (!data.length) {
      return NextResponse.json(
        { error: "Reading data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      books: data[0].books,
      genreAnalysis: data[0].genreAnalysis,
      userName: data[0].userName,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch data",
      },
      { status: 500 }
    );
  }
}
