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
      return <span key={partIndex}>{part}</span>;
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
            className={`inline-block w-28 h-10 mx-2 text-center font-semibold border-2 rounded-lg transition-all duration-200 ${
              showResults 
                ? isCorrect 
                  ? 'border-green-400 bg-green-50 text-green-800' 
                  : isIncorrect 
                    ? 'border-red-400 bg-red-50 text-red-800' 
                    : 'border-gray-300 bg-gray-50'
                : 'border-purple-300 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-purple-400'
            }`}
            placeholder="___"
          />
          {showResults && (
            <span className="ml-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : isIncorrect ? (
                <XCircle className="w-5 h-5 text-red-600" />
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
    <Card className="w-full bg-white shadow-lg border-0 rounded-2xl overflow-hidden my-10">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardTitle className="text-lg font-semibold flex items-center gap-3">
          <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            ✏️
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="text-lg leading-relaxed bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
          {textParts.map((part, index) => renderTextPart(part, index))}
        </div>

        <div className="flex items-center justify-between bg-purple-50 p-4 rounded-xl">
          <div className="text-sm font-medium text-purple-700">
            {showResults ? (
              <span className="flex items-center gap-2">
                🎯 <strong>Kết quả:</strong> {correctAnswers}/{totalBlanks} đúng
                {correctAnswers === totalBlanks && <span className="text-green-600">🎉</span>}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                📝 <strong>Tiến độ:</strong> {filledBlanks}/{totalBlanks} chỗ trống
              </span>
            )}
          </div>

          <div className="flex gap-3">
            {!showResults ? (
              <Button 
                onClick={handleSubmit}
                disabled={filledBlanks === 0}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg"
              >
                ✨ Kiểm tra đáp án
              </Button>
            ) : (
              <Button 
                onClick={handleReset}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold px-6 py-2 rounded-xl"
              >
                🔄 Làm lại
              </Button>
            )}
          </div>
        </div>

        {showResults && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              💡 Đáp án đúng:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {textParts
                .filter((part): part is BlankItem => typeof part === 'object' && part.type === 'blank')
                .map((blank, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <span className="font-mono bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                      #{index + 1}
                    </span>
                    <span className="font-semibold text-gray-700">{blank.correctAnswer}</span>
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
