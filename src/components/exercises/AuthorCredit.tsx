"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, Award } from 'lucide-react';

interface AuthorCreditProps {
  author: string;
  date?: string;
  role?: string;
  avatar?: string;
  bio?: string;
}

export default function AuthorCredit({ 
  author, 
  date, 
  role = "Tác giả",
  avatar,
  bio 
}: AuthorCreditProps) {
  return (
    <Card className="my-6 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {avatar ? (
              <img 
                src={avatar} 
                alt={author}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          
          {/* Thông tin tác giả */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">{author}</span>
              <span className="text-sm text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                {role}
              </span>
            </div>
            
            {date && (
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-1">
                <Calendar className="w-3 h-3" />
                <span>{date}</span>
              </div>
            )}
            
            {bio && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 italic">
                {bio}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
