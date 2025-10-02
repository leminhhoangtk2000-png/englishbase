'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RotateCcw, Play, Lightbulb } from 'lucide-react';

interface FormingQuestionsProps {
  title: string;
  statements: string[];
  correctQuestions: string[];
}

/**
 * NEW Component for W-Fragen forming exercises
 * Converts declarative statements to W-questions
 */
export function FormingQuestions({ title, statements, correctQuestions }: FormingQuestionsProps) {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isChecked, setIsChecked] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);

  // Validate props
  if (!statements || statements.length === 0) {
    return (
      <Card className="border-red-300 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-600">⚠️ Không có dữ liệu bài tập</p>
          <p className="text-xs text-red-500 mt-2">statements: {JSON.stringify(statements)}</p>
        </CardContent>
      </Card>
    );
  }

  const handleAnswerChange = (index: number, value: string) => {
    setUserAnswers({ ...userAnswers, [index]: value });
  };

  const handleCheckAnswers = () => {
    setIsChecked(true);
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsChecked(false);
    setExerciseStarted(false);
  };

  const isCorrectAnswer = (index: number): boolean => {
    if (!isChecked) return false;
    const userAnswer = userAnswers[index]?.trim().toLowerCase() || '';
    const correctAnswer = correctQuestions[index]?.toLowerCase() || '';
    return userAnswer === correctAnswer;
  };

  const getScore = () => {
    let correct = 0;
    statements.forEach((_, index) => {
      if (isCorrectAnswer(index)) correct++;
    });
    return { correct, total: statements.length };
  };

  // Parse highlighted text from <mark> tags or plain text
  const renderStatement = (statement: string) => {
    if (!statement) return null;
    
    // Check if contains <mark> tags
    if (statement.includes('<mark>')) {
      const parts = [];
      let lastIndex = 0;
      const regex = /<mark>(.*?)<\/mark>/g;
      let match;

      while ((match = regex.exec(statement)) !== null) {
        // Add text before mark
        if (match.index > lastIndex) {
          parts.push(statement.substring(lastIndex, match.index));
        }
        // Add marked text
        parts.push(
          <mark key={match.index} className="bg-yellow-200 px-1 rounded font-semibold">
            {match[1]}
          </mark>
        );
        lastIndex = regex.lastIndex;
      }
      // Add remaining text
      if (lastIndex < statement.length) {
        parts.push(statement.substring(lastIndex));
      }
      return parts.length > 0 ? parts : statement;
    }

    return statement;
  };

  // Start screen
  if (!exerciseStarted) {
    return (
      <Card className="my-8 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <p className="text-muted-foreground">
            Chuyển {statements.length} câu khẳng định thành câu hỏi W-Fragen
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-left">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Hướng dẫn:</h4>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Phần <mark className="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">được highlight</mark> là phần cần đặt câu hỏi</li>
                  <li>• Sử dụng từ để hỏi phù hợp: <strong>Wo?</strong> (đâu), <strong>Was?</strong> (gì), <strong>Wer?</strong> (ai), <strong>Wann?</strong> (khi nào)</li>
                  <li>• Nhớ đảo vị trí động từ trong câu hỏi</li>
                  <li>• Viết chính xác dấu câu và chữ hoa</li>
                </ul>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <Button size="lg" onClick={() => setExerciseStarted(true)} className="gap-2">
            <Play className="w-5 h-5" />
            Bắt đầu bài tập
          </Button>
        </CardContent>
      </Card>
    );
  }

  const score = getScore();

  // Exercise screen
  return (
    <Card className="my-8 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <CardTitle className="text-xl">{title}</CardTitle>
          {isChecked && (
            <Badge 
              variant={score.correct === score.total ? "default" : "secondary"}
              className="text-base px-4 py-1"
            >
              Điểm: {score.correct}/{score.total}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {isChecked 
            ? "Kết quả bài tập - So sánh câu trả lời với đáp án" 
            : "Chuyển các câu khẳng định thành câu hỏi W-Fragen"}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {statements.map((statement, index) => {
          const userAnswer = userAnswers[index] || '';
          const isCorrect = isCorrectAnswer(index);
          const hasAnswer = userAnswer.trim() !== '';

          return (
            <div 
              key={index}
              className={`p-5 rounded-lg border-2 transition-all ${
                isChecked && isCorrect 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
                  : isChecked && hasAnswer && !isCorrect
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Original Statement */}
              <div className="mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 min-w-[2rem]">
                    {index + 1}.
                  </span>
                  <div className="flex-1">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {renderStatement(statement)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Answer Input */}
              <div className="flex items-start gap-3 ml-11">
                <span className="text-xl text-gray-600 dark:text-gray-400 mt-2">→</span>
                <div className="flex-1 space-y-2">
                  <Input
                    value={userAnswer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Viết câu hỏi W-Fragen của bạn..."
                    disabled={isChecked}
                    className={`text-base h-12 ${
                      isChecked && isCorrect 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
                        : isChecked && hasAnswer && !isCorrect
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                        : ''
                    }`}
                  />
                  
                  {/* Show result after checking */}
                  {isChecked && (
                    <div className="space-y-2">
                      {isCorrect ? (
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Chính xác!</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                            <XCircle className="w-5 h-5" />
                            <span className="font-medium">Chưa đúng</span>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Đáp án đúng:</p>
                            <p className="text-base font-medium text-green-700 dark:text-green-400">
                              {correctQuestions[index]}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center pt-4">
          {!isChecked ? (
            <Button 
              size="lg"
              onClick={handleCheckAnswers}
              disabled={Object.keys(userAnswers).length === 0}
              className="gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Kiểm tra đáp án
            </Button>
          ) : (
            <Button 
              size="lg"
              onClick={handleReset}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Làm lại
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
