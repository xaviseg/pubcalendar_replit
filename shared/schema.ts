import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// BlogTitleSuggestion model
export const blogTitleSuggestions = pgTable("blog_title_suggestions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  keywords: text("keywords").array().notNull(),
  subject: text("subject").notNull(),
});

export const insertBlogTitleSuggestionSchema = createInsertSchema(blogTitleSuggestions).omit({
  id: true,
});

// BlogTitle model (selected titles for the calendar)
export const blogTitles = pgTable("blog_titles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  keywords: text("keywords").array().notNull(),
  subject: text("subject").notNull(),
  selected: boolean("selected").notNull().default(false),
});

export const insertBlogTitleSchema = createInsertSchema(blogTitles).omit({
  id: true,
});

// Export types
export type InsertBlogTitleSuggestion = z.infer<typeof insertBlogTitleSuggestionSchema>;
export type BlogTitleSuggestion = typeof blogTitleSuggestions.$inferSelect;

export type InsertBlogTitle = z.infer<typeof insertBlogTitleSchema>;
export type BlogTitle = typeof blogTitles.$inferSelect;

// Types for API requests and responses
export const generateTitlesSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
});

export const selectTitlesSchema = z.object({
  titles: z.array(z.number()),
  subject: z.string(),
});

// Type for scheduled blog post in the calendar
export interface ScheduledBlogPost {
  date: Date;
  title: string;
  keywords: string[];
}
