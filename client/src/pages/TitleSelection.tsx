import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, RefreshCw, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BlogTitle } from "@shared/schema";
import TitleCard from "@/components/TitleCard";
import { Skeleton } from "@/components/ui/skeleton";

interface TitleSelectionProps {
  subject: string;
  onChangeSubject: () => void;
  onContinue: () => void;
}

export default function TitleSelection({
  subject,
  onChangeSubject,
  onContinue,
}: TitleSelectionProps) {
  const { toast } = useToast();
  const [selectedTitles, setSelectedTitles] = useState<number[]>([]);

  // Fetch titles for the given subject - we'll use a simplified direct fetch
  const [titles, setTitles] = useState<BlogTitle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const refetch = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/titles?subject=${encodeURIComponent(subject)}`);
      if (!res.ok) throw new Error('Failed to fetch titles');
      const data = await res.json();
      console.log("Directly fetched titles:", data);
      setTitles(data);
      setIsError(false);
    } catch (error) {
      console.error("Error fetching titles:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate titles mutation
  const generateTitlesMutation = useMutation({
    mutationFn: async (subject: string) => {
      console.log("Generating titles for:", subject);
      const res = await apiRequest('POST', '/api/titles/generate', { subject });
      const data = await res.json();
      console.log("Generated titles from API:", data);
      return data;
    },
    onSuccess: (data) => {
      console.log("Setting titles directly from generation response:", data);
      setTitles(data); // Directly update our state with the new titles
      toast({
        title: "Titles generated",
        description: "New blog post titles have been generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate blog titles. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating titles:", error);
    }
  });

  // Update title selection mutation
  const updateTitleSelectionMutation = useMutation({
    mutationFn: async ({ id, selected }: { id: number; selected: boolean }) => {
      console.log(`Updating title #${id} selection to ${selected}`);
      const res = await apiRequest('PATCH', `/api/titles/${id}/select`, { selected });
      return res.json();
    },
    onSuccess: (updatedTitle) => {
      console.log("Selection updated successfully:", updatedTitle);
      
      // Manually update our titles array with the updated title
      setTitles(currentTitles => 
        currentTitles.map(title => 
          title.id === updatedTitle.id ? updatedTitle : title
        )
      );
      
      // Update our selected titles tracking
      if (updatedTitle.selected) {
        setSelectedTitles(prev => [...prev, updatedTitle.id]);
      } else {
        setSelectedTitles(prev => prev.filter(id => id !== updatedTitle.id));
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update selection. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating title selection:", error);
    }
  });

  // Generate titles when component mounts if there are no titles
  useEffect(() => {
    // First, fetch any existing titles
    refetch();
    
    // If no titles found after refetch, we'll generate new ones in the useEffect below
  }, [subject]); // Only depend on subject to avoid loops
  
  // Monitor the titles state to generate if needed
  useEffect(() => {
    if (!isLoading && !isError && titles.length === 0) {
      console.log("No titles found, generating new ones...");
      generateTitlesMutation.mutate(subject);
    }
  }, [titles, isLoading, isError]);

  // Update selected titles when data changes
  useEffect(() => {
    if (titles && titles.length > 0) {
      console.log("Updating selected titles tracking from titles array:", titles);
      const selected = titles
        .filter(title => title.selected)
        .map(title => title.id);
      console.log("Selected title IDs:", selected);
      setSelectedTitles(selected);
    }
  }, [titles]);

  // Handle title selection
  const handleSelectTitle = (id: number, selected: boolean) => {
    updateTitleSelectionMutation.mutate({ id, selected });
  };

  // Regenerate titles
  const handleRegenerateTitles = () => {
    generateTitlesMutation.mutate(subject);
  };

  const handleContinue = () => {
    if (selectedTitles.length === 0) {
      toast({
        title: "No titles selected",
        description: "Please select at least one title to continue.",
        variant: "destructive",
      });
      return;
    }
    onContinue();
  };

  // Loading skeletons
  if (isLoading || generateTitlesMutation.isPending) {
    return (
      <Card className="bg-white shadow mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 justify-between mb-4">
            <div>
              <Skeleton className="h-6 w-64 mb-2" />
              <Skeleton className="h-4 w-80" />
            </div>
          </div>
          <div className="mb-4">
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-5 h-5 rounded" />
                  <div className="w-full">
                    <Skeleton className="h-5 w-full mb-2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-16 rounded-full" />
                      <Skeleton className="h-4 w-20 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-white shadow mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Error Loading Titles</h2>
          <p className="text-red-500 mb-4">Failed to load blog titles. Please try again.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-800">Select titles for your calendar</h2>
            <p className="text-neutral-600 text-sm">Choose the blog titles you want to include in your editorial calendar</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary-50"
              onClick={handleRegenerateTitles}
              disabled={generateTitlesMutation.isPending}
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              Regenerate Titles
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={selectedTitles.length === 0}
            >
              Continue
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Subject tag */}
        <div className="mb-4">
          <Badge className="px-3 py-1 bg-primary-50 text-primary-700 hover:bg-primary-100">
            {subject}
            <button
              className="ml-1 text-primary-400 hover:text-primary-600"
              onClick={onChangeSubject}
            >
              <Pencil className="h-3 w-3" />
            </button>
          </Badge>
        </div>

        {/* Title selections */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {titles?.map((title) => (
            <TitleCard
              key={title.id}
              id={title.id}
              title={title.title}
              keywords={title.keywords}
              isSelected={title.selected}
              onSelect={handleSelectTitle}
            />
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-neutral-600">
            <span className="font-medium">{selectedTitles.length}</span> of{" "}
            <span>{titles?.length || 0}</span> titles selected
          </div>
          <Button 
            className="sm:hidden"
            onClick={handleContinue}
            disabled={selectedTitles.length === 0}
          >
            Continue
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
