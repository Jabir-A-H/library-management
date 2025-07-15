import React from 'react';
import { Moon, Sun, BookOpen, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExportDropdown from '@/components/common/ExportDropdown';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onOpenDocumentation: () => void;
}

function Header({
  darkMode,
  toggleDarkMode,
  onOpenDocumentation,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg"
              aria-label="App logo"
            >
              <BookOpen
                className="h-6 w-6 text-primary-foreground"
                aria-hidden="true"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                ছোটপাতা পাঠাগার গ্রন্থসূচি
              </h1>
              <p className="text-sm text-muted-foreground">
                Organize your book collection
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenDocumentation}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Open help/documentation"
            >
              <HelpCircle className="h-4 w-4 mr-2" aria-hidden="true" />
              Help
            </Button>

            <ExportDropdown />

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="w-10 h-10 p-0"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
