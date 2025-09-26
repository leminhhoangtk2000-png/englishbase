import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

interface ExerciseAuthorProps {
  name?: string;
  bio?: string;
  children?: React.ReactNode;
}

export function ExerciseAuthor({ name = 'Tác giả bài tập', bio, children }: ExerciseAuthorProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto my-6 bg-blue-50 dark:bg-blue-950/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              {name}
            </h4>
            {bio && (
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                {bio}
              </p>
            )}
            {children && (
              <div className="text-sm text-blue-800 dark:text-blue-200">
                {children}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ExerciseHelpProps {
  children?: React.ReactNode;
}

export function ExerciseHelp({ children }: ExerciseHelpProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto my-6 bg-amber-50 dark:bg-amber-950/20">
      <CardContent className="p-4">
        <div className="text-sm text-amber-800 dark:text-amber-200">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}