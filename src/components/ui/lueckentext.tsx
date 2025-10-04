'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle } from 'lucide-react';

interface BlankItem {
  type: 'blank';
  correctAnswer: string;
}

interface TextItem {
  type?: never;
}

type TextPart = string | BlankItem;

interface LueckentextProps {
  title: string;
  textParts: TextPart[];
}

export function Lueckentext({ title, textParts }: LueckentextProps) {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (blankIndex: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [blankIndex]: value
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  const getBlankIndex = (partIndex: number): number => {
    let blankCount = 0;
    for (let i = 0; i < partIndex; i++) {
      const part = textParts[i];
      if (typeof part === 'object' && part.type === 'blank') {
        blankCount++;
      }
    }
    return blankCount;
  };

  const renderTextPart = (part: TextPart, partIndex: number) => {
    if (typeof part === 'string') {
      // Split by newlines and render with <br> tags
      const lines = part.split(/\\n/);
      return (
        <span key={partIndex}>
          {lines.map((line, lineIndex) => (
            <React.Fragment key={`${partIndex}-${lineIndex}`}>
              {line}
              {lineIndex < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      );
    }

    if (part.type === 'blank') {
      const blankIndex = getBlankIndex(partIndex);
      const userAnswer = answers[blankIndex] || '';
      const isCorrect = showResults && userAnswer.toLowerCase().trim() === part.correctAnswer.toLowerCase().trim();
      const isIncorrect = showResults && userAnswer && !isCorrect;

      return (
        <span key={partIndex} className="inline-flex items-center">
          <Input
            type="text"
            value={userAnswer}
            onChange={(e) => handleAnswerChange(blankIndex, e.target.value)}
            disabled={showResults}
            className={`inline-block w-24 h-8 mx-1 text-center text-sm border rounded transition-all duration-200 ${
              showResults 
                ? isCorrect 
                  ? 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-300' 
                  : isIncorrect 
                    ? 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300' 
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                : 'border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-900 hover:border-blue-400 dark:hover:border-blue-500'
            }`}
            placeholder="___"
          />
          {showResults && (
            <span className="ml-1">
              {isCorrect ? (
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : isIncorrect ? (
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              ) : null}
            </span>
          )}
        </span>
      );
    }

    return null;
  };

  const totalBlanks = textParts.filter(part => typeof part === 'object' && part.type === 'blank').length;
  const filledBlanks = Object.keys(answers).filter(key => answers[parseInt(key)].trim()).length;
  const correctAnswers = showResults 
    ? Object.keys(answers).filter(key => {
        const blankIndex = parseInt(key);
        const blank = textParts.find((part, partIndex) => 
          typeof part === 'object' && part.type === 'blank' && getBlankIndex(partIndex) === blankIndex
        ) as BlankItem;
        return blank && answers[blankIndex]?.toLowerCase().trim() === blank.correctAnswer.toLowerCase().trim();
      }).length 
    : 0;

  return (
    <Card className="w-full bg-white dark:bg-background shadow-sm border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden my-6">
      <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="text-base font-medium flex items-center gap-3 text-gray-800 dark:text-gray-100">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-7 h-7 flex items-center justify-center text-sm font-semibold">
            ✏️
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <div className="text-base leading-relaxed bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 rounded-lg border border-gray-200 dark:border-gray-800 whitespace-pre-line">
          {textParts.map((part, index) => renderTextPart(part, index))}
        </div>

        <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-100 dark:border-blue-900">
          <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {showResults ? (
              <span className="flex items-center gap-2">
                <strong>Kết quả:</strong> {correctAnswers}/{totalBlanks} đúng
                {correctAnswers === totalBlanks && <span className="text-green-600 dark:text-green-400">✓</span>}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <strong>Tiến độ:</strong> {filledBlanks}/{totalBlanks} chỗ trống
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {!showResults ? (
              <Button 
                onClick={handleSubmit}
                disabled={filledBlanks === 0}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-md"
              >
                Kiểm tra đáp án
              </Button>
            ) : (
              <Button 
                onClick={handleReset}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 text-sm px-4 py-2 rounded-md"
              >
                Làm lại
              </Button>
            )}
          </div>
        </div>

        {showResults && (
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
            <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              Đáp án đúng:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {textParts
                .filter((part): part is BlankItem => typeof part === 'object' && part.type === 'blank')
                .map((blank, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-800">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-medium">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{blank.correctAnswer}</span>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
