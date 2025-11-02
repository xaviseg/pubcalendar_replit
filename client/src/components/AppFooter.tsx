import { CalendarIcon, GithubIcon, TwitterIcon, LinkedinIcon } from "lucide-react";

export default function AppFooter() {
  return (
    <footer className="bg-neutral-800 text-neutral-300 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <CalendarIcon className="text-primary-100 h-5 w-5 mr-2" />
              <span className="font-semibold">Editorial Calendar Generator</span>
            </div>
            <p className="text-sm text-neutral-400 mt-1">Streamline your content planning</p>
          </div>
          <div className="flex gap-4">
            <a 
              href="https://github.com" 
              className="text-neutral-300 hover:text-white transition-colors"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com" 
              className="text-neutral-300 hover:text-white transition-colors"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              className="text-neutral-300 hover:text-white transition-colors"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-neutral-700 text-sm text-neutral-400 text-center">
          &copy; {new Date().getFullYear()} Editorial Calendar Generator. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
