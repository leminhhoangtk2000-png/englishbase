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
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
              placeholder="..."
            />
            {showFeedback && (
              <span className="ml-2 inline-flex items-center">
                {isCorrect ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600 mr-1" />
                    <span className="text-blue-600 font-medium text-sm">
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
    if (scorePercentage >= 80) return 'text-green-600';
    if (scorePercentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="my-6 border-2 border-blue-100">
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Play className="w-5 h-5" />
          {title || 'Bài tập điền chỗ trống'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Hiển thị đoạn text với xuống dòng */}
        <div className="mb-6 leading-relaxed text-base">
          {renderTextWithLineBreaks()}
        </div>

        {/* Nút Kiểm tra và Làm lại */}
        <div className="flex gap-3 mb-4">
          <Button
            onClick={handleCheck}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={showFeedback}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Kiểm tra
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Làm lại
          </Button>
        </div>

        {/* Kết quả */}
        {showFeedback && (
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                Kết quả: <span className={getScoreColor()}>
                  {correctCount}/{totalBlanks} ({scorePercentage.toFixed(0)}%)
                </span>
              </p>
              
              {scorePercentage >= 80 && (
                <div className="flex items-center text-green-600">
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
