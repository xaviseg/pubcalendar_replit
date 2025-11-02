import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TitleCardProps {
  id: number;
  title: string;
  keywords: string[];
  isSelected: boolean;
  onSelect: (id: number, selected: boolean) => void;
}

export default function TitleCard({ id, title, keywords, isSelected, onSelect }: TitleCardProps) {
  const handleClick = () => {
    console.log(`Selecting title #${id}, setting selected to ${!isSelected}`);
    onSelect(id, !isSelected);
  };

  return (
    <div 
      className={cn(
        "title-card border rounded-lg p-4 cursor-pointer transition-all",
        isSelected ? "border-primary bg-primary-50" : "border-gray-200 hover:border-primary-300 hover:bg-primary-50"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <div 
            className={cn(
              "w-5 h-5 border-2 rounded flex items-center justify-center",
              isSelected ? "border-primary" : "border-neutral-300"
            )}
          >
            {isSelected && <CheckIcon className="w-3 h-3 text-primary" />}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-neutral-800 mb-1">{title}</h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="bg-secondary-50 text-secondary-500 hover:bg-secondary-100">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
