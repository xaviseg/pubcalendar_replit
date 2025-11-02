import ical from 'ical-generator';
import { format } from 'date-fns';
import { ScheduledBlogPost } from "@shared/schema";

/**
 * Generate an iCal file from scheduled blog posts
 * @param posts Array of scheduled blog posts
 * @param subject The blog subject
 */
export function generateICalFile(posts: ScheduledBlogPost[], subject: string): void {
  // Create a new calendar
  const calendar = ical({ name: `Editorial Calendar: ${subject}` });
  
  // Add each post as an event
  posts.forEach(post => {
    // Create event
    const eventDate = new Date(post.date);
    // Events are all-day
    const event = calendar.createEvent({
      start: eventDate,
      end: eventDate,
      allDay: true,
      summary: post.title,
      description: `Keywords: ${post.keywords.join(', ')}`,
      location: 'Blog',
      categories: [{ name: 'Blog Post' }],
    });
  });
  
  // Generate formatted date for the filename
  const dateFormatted = format(new Date(), 'yyyy-MM-dd');
  const sanitizedSubject = subject.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `editorial_calendar_${sanitizedSubject}_${dateFormatted}.ics`;
  
  // Generate the iCal file string
  const icalString = calendar.toString();
  
  // Create a blob and download the file
  const blob = new Blob([icalString], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
