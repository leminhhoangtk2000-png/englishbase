import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

interface AuthorCreditProps {
  author: string;
  date?: string;
  avatar?: string;
}

export function AuthorCredit({ author, date, avatar }: AuthorCreditProps) {
  return (
    <Card className="w-full bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {avatar ? (
              <img 
                src={avatar} 
                alt={author}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Tác giả</p>
            <p className="font-medium text-gray-900">{author}</p>
            {date && (
              <p className="text-xs text-gray-500 mt-1">{date}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
