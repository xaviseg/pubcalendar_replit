import { useState } from "react";
import WorkflowProgress from "@/components/WorkflowProgress";
import SubjectInput from "./SubjectInput";
import TitleSelection from "./TitleSelection";
import CalendarView from "./CalendarView";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [subject, setSubject] = useState("");
  
  // Handle subject submission
  const handleSubjectSubmit = (newSubject: string) => {
    setSubject(newSubject);
    setCurrentStep(2);
  };

  // Go back to subject input
  const handleChangeSubject = () => {
    setCurrentStep(1);
  };

  // Continue to calendar generation
  const handleContinueToCalendar = () => {
    setCurrentStep(3);
  };

  // Go back to title selection
  const handleBackToTitles = () => {
    setCurrentStep(2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <WorkflowProgress currentStep={currentStep} />
      
      {currentStep === 1 && (
        <SubjectInput onSubmit={handleSubjectSubmit} initialSubject={subject} />
      )}
      
      {currentStep === 2 && (
        <TitleSelection 
          subject={subject} 
          onChangeSubject={handleChangeSubject}
          onContinue={handleContinueToCalendar}
        />
      )}
      
      {currentStep === 3 && (
        <CalendarView 
          subject={subject}
          onBack={handleBackToTitles}
        />
      )}
    </div>
  );
}
