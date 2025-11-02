import { cn } from "@/lib/utils";

interface StepProps {
  step: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

function Step({ step, label, isActive, isCompleted }: StepProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold",
          isCompleted || isActive
            ? "bg-primary text-white"
            : "bg-neutral-300 text-neutral-700"
        )}
      >
        {step}
      </div>
      <span
        className={cn(
          "mt-2 text-sm font-medium",
          isCompleted || isActive ? "text-neutral-800" : "text-neutral-500"
        )}
      >
        {label}
      </span>
    </div>
  );
}

interface WorkflowProgressProps {
  currentStep: number;
}

export default function WorkflowProgress({ currentStep }: WorkflowProgressProps) {
  return (
    <div className="relative">
      <div className="flex justify-between mb-8 mx-auto max-w-3xl">
        <Step
          step={1}
          label="Enter Subject"
          isActive={currentStep === 1}
          isCompleted={currentStep > 1}
        />
        <div className="flex-1 flex items-center">
          <div 
            className={cn(
              "h-1 w-full", 
              currentStep > 1 ? "bg-primary" : "bg-neutral-300"
            )}
          />
        </div>
        <Step
          step={2}
          label="Select Titles"
          isActive={currentStep === 2}
          isCompleted={currentStep > 2}
        />
        <div className="flex-1 flex items-center">
          <div 
            className={cn(
              "h-1 w-full", 
              currentStep > 2 ? "bg-primary" : "bg-neutral-300"
            )}
          />
        </div>
        <Step
          step={3}
          label="Generate Calendar"
          isActive={currentStep === 3}
          isCompleted={false}
        />
      </div>
    </div>
  );
}
