"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, RotateCcw, Play } from 'lucide-react';

interface BlankType {
  type: 'blank';
  correctAnswer: string;
}

interface TextPart {
  type?: never;
}

type TextPartType = string | BlankType | TextPart;

interface LueckentextProps {
  title?: string;
  textParts: TextPartType[];
}

export default function Lueckentext({ title, textParts }: LueckentextProps) {
  // Tạo state cho câu trả lời người dùng
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(
    textParts.map((part) => (typeof part === 'object' && part.type === 'blank' ? '' : null))
  );

  // Khi bấm Kiểm tra, ta cho hiển thị feedback
  const [showFeedback, setShowFeedback] = useState(false);

  // Hàm xử lý khi người dùng nhập vào 1 ô trống
  const handleChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  // Tính tổng số blank
  const totalBlanks = textParts.filter(
    (part) => typeof part === 'object' && part.type === 'blank'
  ).length;

  // Tính số blank đúng
  const correctCount = textParts.reduce((count, part, idx) => {
    if (typeof part === 'object' && part.type === 'blank') {
      const userAnswer = userAnswers[idx]?.trim();
      const correct = part.correctAnswer.trim();
      if (userAnswer === correct) {
        return count + 1;
      }
    }
    return count;
  }, 0);

  // Khi bấm "Kiểm tra"
  const handleCheck = () => {
    setShowFeedback(true);
  };

  // Khi bấm "Làm lại"
  const handleReset = () => {
    const resetAnswers = userAnswers.map((ans, idx) =>
      typeof textParts[idx] === 'object' && (textParts[idx] as BlankType).type === 'blank' ? '' : null
    );
    setUserAnswers(resetAnswers);
    setShowFeedback(false);
  };

  // Hàm xử lý xuống dòng
  const renderTextWithLineBreaks = () => {
    const elements: React.ReactNode[] = [];
    let currentLine: React.ReactNode[] = [];

    textParts.forEach((part, index) => {
      if (typeof part === 'string') {
        const lines = part.split('\n');
        lines.forEach((line, lineIndex) => {
          if (lineIndex > 0) {
            elements.push(
              <div key={`${index}-${lineIndex}-line`} className="mb-2">
                {currentLine}
              </div>
            );
            currentLine = [];
          }
          if (line) {
            currentLine.push(
              <span key={`${index}-${lineIndex}`}>{line}</span>
            );
          }
        });
      } else if (typeof part === 'object' && part.type === 'blank') {
        const userAnswer = userAnswers[index] ?? '';
        const isCorrect = userAnswer.trim() === part.correctAnswer.trim();

        currentLine.push(
          <span key={index} className="inline-block mr-1">
            <Input
              type="text"
              value={userAnswer}
              onChange={(e) => handleChange(index, e.target.value)}
              className={`inline-block w-32 h-8 text-sm ${
                showFeedback
                  ? isCorrect
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
              placeholder="..."
            />
            {showFeedback && (
              <span className="ml-2 inline-flex items-center">
                {isCorrect ? (
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mr-1" />
                    <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                      {part.correctAnswer}
                    </span>
                  </>
                )}
              </span>
            )}
          </span>
        );
      }
    });

    // Thêm dòng cuối cùng nếu còn
    if (currentLine.length > 0) {
      elements.push(
        <div key="last-line" className="mb-2">
          {currentLine}
        </div>
      );
    }

    return elements;
  };

  const scorePercentage = totalBlanks > 0 ? (correctCount / totalBlanks) * 100 : 0;
  const getScoreColor = () => {
    if (scorePercentage >= 80) return 'text-green-600 dark:text-green-400';
    if (scorePercentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <Card className="my-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          {title || 'Bài tập điền chỗ trống'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 bg-white dark:bg-gray-900">
        {/* Hiển thị đoạn text với xuống dòng */}
        <div className="mb-6 leading-relaxed text-base text-gray-800 dark:text-gray-200">
          {renderTextWithLineBreaks()}
        </div>

        {/* Nút Kiểm tra và Làm lại */}
        <div className="flex gap-3 mb-4">
          <Button
            onClick={handleCheck}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
            disabled={showFeedback}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Kiểm tra
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Làm lại
          </Button>
        </div>

        {/* Kết quả */}
        {showFeedback && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Kết quả: <span className={getScoreColor()}>
                  {correctCount}/{totalBlanks} ({scorePercentage.toFixed(0)}%)
                </span>
              </p>
              
              {scorePercentage >= 80 && (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5 mr-1" />
                  <span className="font-medium">Xuất sắc!</span>
                </div>
              )}
              
              {scorePercentage >= 60 && scorePercentage < 80 && (
                <div className="flex items-center text-yellow-600">
                  <span className="font-medium">Khá tốt!</span>
                </div>
              )}
              
              {scorePercentage < 60 && (
                <div className="flex items-center text-red-600">
                  <span className="font-medium">Cần cải thiện</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
