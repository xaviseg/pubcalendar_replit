import OpenAI from "openai";
import { type InsertBlogTitleSuggestion } from "@shared/schema";
import dotenv from "dotenv";
dotenv.config();
// Initialize the OpenAI client with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
});

// Interface for the response from OpenAI
interface TitleSuggestionResponse {
  titles: Array<{
    title: string;
    keywords: string[];
  }>;
}

/**
 * Generate blog post title suggestions using OpenAI
 * @param subject The blog subject to generate titles for
 * @param count Number of titles to generate (default: 10)
 * @returns Array of generated blog title suggestions
 */
export async function generateBlogTitles(
  subject: string,
  count: number = 10
): Promise<InsertBlogTitleSuggestion[]> {
  try {
    const prompt = `
    Generate ${count} creative, engaging, and SEO-friendly blog post titles based on the subject: "${subject}".
    
    For each title, also provide 2-3 relevant keywords that would be good for SEO.
    
    The output should be a JSON array with the following structure:
    {
      "titles": [
        {
          "title": "Blog post title here",
          "keywords": ["keyword1", "keyword2", "keyword3"]
        },
        ...
      ]
    }
    
    Make sure the titles are:
    - Unique and diverse in structure
    - Attention-grabbing
    - Clear and specific
    - Between 40-70 characters long
    - Use power words and numbers where appropriate
    
    Avoid clickbait tactics but ensure the titles are compelling.
    `;

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional content strategist and SEO expert.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const data = JSON.parse(content) as TitleSuggestionResponse;

    // Map to our schema
    return data.titles.map((item) => ({
      title: item.title,
      keywords: item.keywords,
      subject,
    }));
  } catch (error) {
    console.error("Error generating blog titles:", error);
    throw new Error("Failed to generate blog titles. Please try again later.");
  }
}
