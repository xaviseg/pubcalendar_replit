import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download } from "lucide-react";
import { BlogTitle, ScheduledBlogPost } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { getNextMonday, formatDate } from "@/lib/dateUtils";
import { generateICalFile } from "@/lib/icalGenerator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CalendarViewProps {
  subject: string;
  onBack: () => void;
}

export default function CalendarView({ subject, onBack }: CalendarViewProps) {
  const { toast } = useToast();
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledBlogPost[]>([]);
  const [startDate] = useState<Date>(getNextMonday());

  // Fetch selected titles
  const { data: selectedTitles, isLoading, isError } = useQuery<BlogTitle[]>({
    queryKey: ['/api/calendar', subject],
    queryFn: async () => {
      const res = await fetch(`/api/calendar?subject=${encodeURIComponent(subject)}`);
      if (!res.ok) throw new Error('Failed to fetch selected titles');
      return res.json();
    }
  });

  // Create schedule when selected titles change
  useEffect(() => {
    if (selectedTitles && selectedTitles.length > 0) {
      const scheduledBlogPosts: ScheduledBlogPost[] = [];
      const publicationDays = [1, 4]; // Monday and Thursday (0 = Sunday, 1 = Monday, ...)
      
      let currentDate = new Date(startDate);
      let titleIndex = 0;
      
      while (titleIndex < selectedTitles.length) {
        const dayOfWeek = currentDate.getDay();
        
        if (publicationDays.includes(dayOfWeek)) {
          scheduledBlogPosts.push({
            date: new Date(currentDate),
            title: selectedTitles[titleIndex].title,
            keywords: selectedTitles[titleIndex].keywords
          });
          
          titleIndex++;
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setScheduledPosts(scheduledBlogPosts);
    }
  }, [selectedTitles, startDate]);

  // Handle download iCal file
  const handleDownloadCalendar = () => {
    if (scheduledPosts.length === 0) {
      toast({
        title: "No posts to schedule",
        description: "Please select some blog titles first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      generateICalFile(scheduledPosts, subject);
      toast({
        title: "Calendar downloaded",
        description: "Your editorial calendar has been downloaded as an iCal file.",
      });
    } catch (error) {
      console.error("Error generating iCal file:", error);
      toast({
        title: "Error",
        description: "Failed to generate iCal file. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-white shadow mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 justify-between mb-6">
            <Skeleton className="h-6 w-64 mb-2" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="mb-4">
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32"><Skeleton className="h-4 w-16" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-40" /></TableHead>
                  <TableHead className="w-40"><Skeleton className="h-4 w-20" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(4).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (isError) {
    return (
      <Card className="bg-white shadow mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Error Loading Calendar</h2>
          <p className="text-red-500 mb-4">Failed to load selected blog titles. Please try again.</p>
          <Button onClick={onBack}>Back to Titles</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-800">Your Editorial Calendar</h2>
            <p className="text-neutral-600 text-sm">Review and download your publication schedule (2 posts per week)</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleDownloadCalendar}>
              <Download className="mr-1 h-4 w-4" />
              Download iCal File
            </Button>
          </div>
        </div>

        {/* Calendar header */}
        <div className="mb-4 flex items-center flex-wrap gap-2">
          <Badge className="px-3 py-1 bg-primary-50 text-primary-700">
            {subject}
          </Badge>
          <span className="text-sm text-neutral-500">
            Starting <span className="font-medium">{formatDate(startDate, 'full')}</span>
          </span>
        </div>

        {/* Calendar display */}
        <div className="overflow-x-auto">
          <Table className="min-w-full mb-4">
            <TableHeader>
              <TableRow>
                <TableHead className="w-32 bg-neutral-50">Date</TableHead>
                <TableHead className="bg-neutral-50">Blog Post Title</TableHead>
                <TableHead className="w-40 bg-neutral-50">Keywords</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledPosts.length > 0 ? (
                scheduledPosts.map((post, index) => (
                  <TableRow key={index}>
                    <TableCell className="whitespace-nowrap text-sm text-neutral-700">
                      {formatDate(post.date, 'short')}
                    </TableCell>
                    <TableCell className="text-sm text-neutral-900">
                      {post.title}
                    </TableCell>
                    <TableCell className="text-sm text-neutral-700">
                      <div className="flex flex-wrap gap-1">
                        {post.keywords.map((keyword, keywordIndex) => (
                          <Badge
                            key={keywordIndex}
                            variant="secondary"
                            className="text-xs px-2 py-0.5 bg-secondary-50 text-secondary-500"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-neutral-500">
                    No blog posts selected. Please go back and select some titles.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="text-sm text-neutral-500 italic">
          Note: The iCal file will include all selected blog posts scheduled on Mondays and Thursdays.
        </div>
      </CardContent>
    </Card>
  );
}
