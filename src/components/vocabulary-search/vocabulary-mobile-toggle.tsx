'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BookOpen } from 'lucide-react';
import { VocabularySidebar } from './vocabulary-sidebar';

export function VocabularyMobileToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden fixed bottom-6 right-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-14 h-14 p-0"
          >
            <BookOpen className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:w-96 p-0">
          <VocabularySidebar className="h-full" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
