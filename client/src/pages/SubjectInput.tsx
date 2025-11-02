import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SubjectInputProps {
  onSubmit: (subject: string) => void;
  initialSubject?: string;
}

export default function SubjectInput({ onSubmit, initialSubject = "" }: SubjectInputProps) {
  const [subject, setSubject] = useState(initialSubject);
  const [error, setError] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
    if (e.target.value.trim() !== "") {
      setError(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim()) {
      setError(true);
      return;
    }
    
    onSubmit(subject.trim());
  };

  return (
    <Card className="bg-white shadow mb-6">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">What's your blog about?</h2>
        <div className="space-y-4">
          <p className="text-neutral-600">Enter a subject to generate blog post title suggestions.</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <Input
                type="text"
                id="blog-subject"
                placeholder="e.g., sustainable gardening, artificial intelligence, vegan cooking"
                value={subject}
                onChange={handleInputChange}
                className={error ? "border-red-500 focus:ring-red-500" : ""}
              />
              {error && (
                <div className="mt-1 text-sm text-red-500">
                  Please enter a subject to continue
                </div>
              )}
            </div>
            <Button type="submit" className="whitespace-nowrap">
              Generate Titles
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
