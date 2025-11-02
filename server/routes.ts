import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateBlogTitles } from "./openai";
import { 
  generateTitlesSchema, 
  selectTitlesSchema,
  type BlogTitleSuggestion
} from "@shared/schema";
import { ZodError } from "zod";

// Helper for handling validation errors
function handleValidationError(error: unknown, res: Response) {
  if (error instanceof ZodError) {
    const issues = error.format();
    return res.status(400).json({ 
      message: "Validation error", 
      errors: issues 
    });
  }
  
  console.error(error);
  return res.status(500).json({ 
    message: "An unexpected error occurred" 
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate blog title suggestions
  app.post("/api/titles/generate", async (req: Request, res: Response) => {
    try {
      const { subject } = generateTitlesSchema.parse(req.body);
      
      console.log(`Generating titles for subject: "${subject}"`);
      
      // Generate new titles using OpenAI regardless of existing suggestions
      const generatedTitles = await generateBlogTitles(subject);
      
      console.log(`Generated ${generatedTitles.length} titles`);
      
      // Store the generated titles
      const createdTitles = await storage.createBlogTitleSuggestions(generatedTitles);
      
      // Delete any existing blog titles for this subject to avoid duplicates
      const existingTitles = await storage.getBlogTitles(subject);
      console.log(`Found ${existingTitles.length} existing titles to replace`);
      
      // Create new blog title entries with selected=false by default
      const newTitles = [];
      for (const title of generatedTitles) {
        const newTitle = await storage.createBlogTitle({
          ...title,
          selected: false
        });
        newTitles.push(newTitle);
      }
      
      console.log(`Created ${newTitles.length} new blog titles`);
      return res.json(newTitles);
    } catch (error) {
      console.error("Error generating titles:", error);
      return handleValidationError(error, res);
    }
  });
  
  // Get blog titles for a subject
  app.get("/api/titles", async (req: Request, res: Response) => {
    try {
      const subject = req.query.subject as string;
      if (!subject) {
        return res.status(400).json({ message: "Subject is required" });
      }
      
      const titles = await storage.getBlogTitles(subject);
      return res.json(titles);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to retrieve blog titles" });
    }
  });
  
  // Update blog title selection
  app.patch("/api/titles/:id/select", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const selected = req.body.selected === true;
      
      console.log(`API received request to update title #${id} selected=${selected}`, req.body);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const updatedTitle = await storage.updateBlogTitleSelection(id, selected);
      console.log("API returning updated title:", updatedTitle);
      return res.json(updatedTitle);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to update blog title selection" });
    }
  });
  
  // Get selected blog titles for calendar
  app.get("/api/calendar", async (req: Request, res: Response) => {
    try {
      const subject = req.query.subject as string;
      if (!subject) {
        return res.status(400).json({ message: "Subject is required" });
      }
      
      const selectedTitles = await storage.getSelectedBlogTitles(subject);
      return res.json(selectedTitles);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to retrieve selected titles" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
