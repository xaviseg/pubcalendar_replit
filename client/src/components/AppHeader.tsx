import { CalendarIcon } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="text-primary h-6 w-6 mr-2" />
            <h1 className="text-xl font-semibold text-neutral-800">Editorial Calendar Generator</h1>
          </div>
          <div>
            <span className="hidden sm:inline-block text-sm text-neutral-500">Plan your content strategy</span>
          </div>
        </div>
      </div>
    </header>
  );
}
