import React from 'react';
import { Card } from '@/components/ui/card';

interface AuthorCreditProps {
  author?: string;
  description?: string;
  avatar?: string;
}

export default function AuthorCredit({ 
  author = "Lonia", 
  description = "Một cô gái nhỏ dễ thương có mơ ước trở thành người nổi tiếng nhưng hay ngại, có B2 tiếng Đức 😳💫",
  avatar 
}: AuthorCreditProps) {
  return (
    <Card className="p-4 mt-8 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
      <div className="flex items-center space-x-4">
        {avatar && (
          <img src={avatar} alt={author} className="w-12 h-12 rounded-full" />
        )}
        <div className="flex-1">
          <p className="text-sm text-gray-600">
            📝 <strong>Biên soạn bởi:</strong> {author}
          </p>
          <p className="text-xs text-gray-500 italic mt-1">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
