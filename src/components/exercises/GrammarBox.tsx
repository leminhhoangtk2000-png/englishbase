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
      case 'A1': return 'bg-green-100 text-green-800 border-green-300';
      case 'A2': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'B1': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'B2': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'C1': return 'bg-red-100 text-red-800 border-red-300';
      case 'C2': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="my-6 border-2 border-indigo-100">
      <CardHeader className="bg-indigo-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-800">
            <Book className="w-5 h-5" />
            {title}
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(level)}`}>
            {level}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Grammar Rules */}
        <div className="space-y-6">
          {rules.map((rule, index) => (
            <div key={index} className="border-l-4 border-indigo-400 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                {index + 1}. {rule.rule}
              </h4>
              <p className="text-gray-700 mb-3">
                {rule.explanation}
              </p>
              
              {/* Examples */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-2">Ví dụ:</h5>
                <ul className="space-y-1">
                  {rule.examples.map((example, exIndex) => (
                    <li key={exIndex} className="text-gray-700 flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
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
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="flex items-center gap-2 font-semibold text-green-800 mb-3">
              <Lightbulb className="w-4 h-4" />
              Mẹo ghi nhớ:
            </h4>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="text-green-700 flex items-start">
                  <Target className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Exceptions */}
        {exceptions.length > 0 && (
          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="flex items-center gap-2 font-semibold text-orange-800 mb-3">
              <AlertCircle className="w-4 h-4" />
              Ngoại lệ cần lưu ý:
            </h4>
            <ul className="space-y-2">
              {exceptions.map((exception, index) => (
                <li key={index} className="text-orange-700 flex items-start">
                  <AlertCircle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
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
