import { pgTable, varchar, timestamp, json } from "drizzle-orm/pg-core";

export const readingData = pgTable("reading_data", {
  id: varchar("id", { length: 10 }).primaryKey(),
  name: varchar("name").notNull(),
  books: json("books").notNull(),
  genreAnalysis: json("genre_analysis"),
  createdAt: timestamp("created_at").defaultNow(),
});
