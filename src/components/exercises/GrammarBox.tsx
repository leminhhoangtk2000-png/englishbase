"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Target, AlertCircle, Lightbulb } from 'lucide-react';

interface GrammarRule {
  rule: string;
  explanation: string;
  examples: string[];
}

interface GrammarBoxProps {
  title: string;
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  rules: GrammarRule[];
  tips?: string[];
  exceptions?: string[];
}

export default function GrammarBox({ 
  title, 
  level = 'A1', 
  rules, 
  tips = [], 
  exceptions = [] 
}: GrammarBoxProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A1': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700';
      case 'A2': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'B1': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'B2': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700';
      case 'C1': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'C2': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700';
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-800';
    }
  };

  return (
    <Card className="my-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Book className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            {title}
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(level)}`}>
            {level}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 bg-white dark:bg-gray-900">
        {/* Grammar Rules */}
        <div className="space-y-6">
          {rules.map((rule, index) => (
            <div key={index} className="border-l-4 border-blue-400 dark:border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {index + 1}. {rule.rule}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {rule.explanation}
              </p>
              
              {/* Examples */}
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Ví dụ:</h5>
                <ul className="space-y-1">
                  {rule.examples.map((example, exIndex) => (
                    <li key={exIndex} className="text-gray-700 dark:text-gray-300 flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      <span className="font-mono text-sm">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        {tips.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
            <h4 className="flex items-center gap-2 font-semibold text-green-800 dark:text-green-200 mb-3">
              <Lightbulb className="w-4 h-4" />
              Mẹo ghi nhớ:
            </h4>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="text-green-700 dark:text-green-300 flex items-start">
                  <Target className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Exceptions */}
        {exceptions.length > 0 && (
          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
            <h4 className="flex items-center gap-2 font-semibold text-orange-800 dark:text-orange-200 mb-3">
              <AlertCircle className="w-4 h-4" />
              Ngoại lệ cần lưu ý:
            </h4>
            <ul className="space-y-2">
              {exceptions.map((exception, index) => (
                <li key={index} className="text-orange-700 dark:text-orange-300 flex items-start">
                  <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{exception}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
