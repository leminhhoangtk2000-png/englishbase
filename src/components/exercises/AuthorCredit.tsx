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
    <Card className="my-6 border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {avatar ? (
              <img 
                src={avatar} 
                alt={author}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          
          {/* Thông tin tác giả */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-800">{author}</span>
              <span className="text-sm text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                {role}
              </span>
            </div>
            
            {date && (
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <Calendar className="w-3 h-3" />
                <span>{date}</span>
              </div>
            )}
            
            {bio && (
              <p className="text-sm text-gray-700 mt-2 italic">
                {bio}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
