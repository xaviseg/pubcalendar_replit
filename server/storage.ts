import { 
  type BlogTitleSuggestion, 
  type InsertBlogTitleSuggestion,
  type BlogTitle,
  type InsertBlogTitle,
} from "@shared/schema";

export interface IStorage {
  // BlogTitleSuggestion methods
  getBlogTitleSuggestions(subject: string): Promise<BlogTitleSuggestion[]>;
  createBlogTitleSuggestions(titles: InsertBlogTitleSuggestion[]): Promise<BlogTitleSuggestion[]>;
  
  // BlogTitle methods
  getBlogTitles(subject: string): Promise<BlogTitle[]>;
  createBlogTitle(title: InsertBlogTitle): Promise<BlogTitle>;
  getSelectedBlogTitles(subject: string): Promise<BlogTitle[]>;
  updateBlogTitleSelection(id: number, selected: boolean): Promise<BlogTitle>;
}

export class MemStorage implements IStorage {
  private titleSuggestions: Map<number, BlogTitleSuggestion>;
  private blogTitles: Map<number, BlogTitle>;
  private currentTitleSuggestionId: number;
  private currentBlogTitleId: number;

  constructor() {
    this.titleSuggestions = new Map();
    this.blogTitles = new Map();
    this.currentTitleSuggestionId = 1;
    this.currentBlogTitleId = 1;
  }

  // BlogTitleSuggestion methods
  async getBlogTitleSuggestions(subject: string): Promise<BlogTitleSuggestion[]> {
    return Array.from(this.titleSuggestions.values())
      .filter(suggestion => suggestion.subject.toLowerCase() === subject.toLowerCase());
  }

  async createBlogTitleSuggestions(titles: InsertBlogTitleSuggestion[]): Promise<BlogTitleSuggestion[]> {
    const createdTitles: BlogTitleSuggestion[] = [];

    for (const title of titles) {
      const id = this.currentTitleSuggestionId++;
      const newTitle: BlogTitleSuggestion = { ...title, id };
      this.titleSuggestions.set(id, newTitle);
      createdTitles.push(newTitle);
    }

    return createdTitles;
  }

  // BlogTitle methods
  async getBlogTitles(subject: string): Promise<BlogTitle[]> {
    return Array.from(this.blogTitles.values())
      .filter(title => title.subject.toLowerCase() === subject.toLowerCase());
  }

  async createBlogTitle(title: InsertBlogTitle): Promise<BlogTitle> {
    const id = this.currentBlogTitleId++;
    
    // Ensure we have the required 'selected' field with a default value
    // This fixes the TypeScript error with the spreading
    const newTitle: BlogTitle = { 
      id, 
      title: title.title,
      keywords: title.keywords,
      subject: title.subject,
      selected: title.selected !== undefined ? title.selected : false
    };
    
    this.blogTitles.set(id, newTitle);
    return newTitle;
  }

  async getSelectedBlogTitles(subject: string): Promise<BlogTitle[]> {
    return Array.from(this.blogTitles.values())
      .filter(title => 
        title.subject.toLowerCase() === subject.toLowerCase() && 
        title.selected
      );
  }

  async updateBlogTitleSelection(id: number, selected: boolean): Promise<BlogTitle> {
    const title = this.blogTitles.get(id);
    if (!title) {
      throw new Error(`Blog title with id ${id} not found`);
    }

    console.log(`Updating title #${id} selection to ${selected}`, title);
    
    const updatedTitle = { ...title, selected };
    this.blogTitles.set(id, updatedTitle);
    
    console.log("Title after update:", this.blogTitles.get(id));
    
    return updatedTitle;
  }
}

export const storage = new MemStorage();
