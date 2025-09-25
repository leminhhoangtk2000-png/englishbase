'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RotateCcw, Play, Lightbulb } from 'lucide-react';

interface FormingQuestionsSimpleProps {
  title?: string;
  exercises: {
    id: number;
    statement: string;
    correctAnswer: string;
  }[];
}

export function FormingQuestionsSimple({ title = "W-Fragen Exercise", exercises }: FormingQuestionsSimpleProps) {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
    setIsStarted(false);
  };

  const getAnswerResult = (exercise: any): 'correct' | 'incorrect' | 'unanswered' => {
    if (!showResults) return 'unanswered';
    
    const userAnswer = answers[exercise.id]?.trim().toLowerCase();
    const correctAnswer = exercise.correctAnswer.toLowerCase();
    
    if (!userAnswer) return 'unanswered';
    
    return userAnswer === correctAnswer ? 'correct' : 'incorrect';
  };

  const getScore = (): { correct: number; total: number } => {
    let correct = 0;
    exercises.forEach((exercise) => {
      if (getAnswerResult(exercise) === 'correct') {
        correct++;
      }
    });
    return { correct, total: exercises.length };
  };

  const allAnswered = exercises.every(ex => answers[ex.id]?.trim());
  const { correct, total } = getScore();

  // Extract highlighted parts from statements (text between asterisks)
  const extractHighlight = (statement: string) => {
    const parts = statement.split(/\*([^*]+)\*/);
    return parts.map((part, index) => 
      index % 2 === 1 ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded font-semibold">
          {part}
        </mark>
      ) : part
    );
  };

  if (!isStarted) {
    return (
      <Card className="w-full max-w-4xl mx-auto mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <p className="text-muted-foreground">
            Chuyển {exercises.length} câu khẳng định thành câu hỏi W-Fragen
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-left">
                <p className="font-medium text-blue-800 mb-2">Hướng dẫn:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Phần <mark className="bg-yellow-200 px-1 rounded">được highlight</mark> là phần cần đặt câu hỏi</li>
                  <li>• Sử dụng từ để hỏi phù hợp: Wo? (đâu), Was? (gì), Wer? (ai), Wann? (khi nào), etc.</li>
                  <li>• Nhớ đảo vị trí động từ trong câu hỏi</li>
                  <li>• Viết chính xác dấu câu và chữ hoa</li>
                </ul>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={handleStart} className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Bắt đầu bài tập
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-5xl mx-auto mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          {showResults && (
            <Badge variant={correct === total ? "default" : "secondary"} className="text-lg px-3 py-1">
              {correct}/{total} đúng
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {showResults 
            ? "Kết quả bài tập - So sánh câu trả lời của bạn với đáp án" 
            : "Chuyển các câu khẳng định thành câu hỏi W-Fragen. Phần highlight là phần cần đặt câu hỏi."
          }
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {exercises.map((exercise) => {
            const result = getAnswerResult(exercise);
            const userAnswer = answers[exercise.id] || '';
            
            return (
              <div
                key={exercise.id}
                className={`
                  p-4 rounded-lg border transition-all duration-200
                  ${showResults && result === 'correct' ? 'border-green-500 bg-green-50' : ''}
                  ${showResults && result === 'incorrect' ? 'border-red-500 bg-red-50' : ''}
                  ${showResults && result === 'unanswered' ? 'border-yellow-500 bg-yellow-50' : ''}
                  ${!showResults ? 'border-gray-200 hover:border-blue-300' : ''}
                `}
              >
                <div className="space-y-3">
                  {/* Original Statement - THIS IS THE CARD YOU MENTIONED */}
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-blue-700 min-w-[30px]">
                        {exercise.id}.
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium text-lg">
                          {extractHighlight(exercise.statement)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Question Input */}
                  <div className="flex items-center gap-2 ml-8">
                    <span className="text-sm font-medium text-gray-600 min-w-[40px]">
                      →
                    </span>
                    <Input
                      value={userAnswer}
                      onChange={(e) => handleAnswerChange(exercise.id, e.target.value)}
                      placeholder="Viết câu hỏi W-Fragen..."
                      disabled={showResults}
                      className={`
                        flex-1
                        ${showResults && result === 'correct' ? 'border-green-500 bg-green-50' : ''}
                        ${showResults && result === 'incorrect' ? 'border-red-500 bg-red-50' : ''}
                      `}
                    />
                    
                    {/* Result Icon */}
                    {showResults && (
                      <div className="flex items-center gap-2">
                        {result === 'correct' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {result === 'incorrect' && <XCircle className="h-5 w-5 text-red-600" />}
                        {result === 'unanswered' && <div className="w-5 h-5 rounded-full border-2 border-yellow-500" />}
                      </div>
                    )}
                  </div>

                  {/* Show correct answer when wrong */}
                  {showResults && result === 'incorrect' && (
                    <div className="ml-8 pl-12 text-sm">
                      <p className="text-green-700 bg-green-50 p-2 rounded border border-green-200">
                        <strong>Đáp án đúng:</strong> {exercise.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Action buttons */}
        <div className="mt-8 flex justify-center gap-4">
          {!showResults ? (
            <>
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Kiểm tra đáp án
                {!allAnswered && <span className="text-xs">({Object.keys(answers).length}/{exercises.length})</span>}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Làm lại
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {correct === total ? (
                <div className="text-center">
                  <Badge variant="default" className="text-lg px-4 py-2 mb-2">
                    Hoàn hảo! 🎉 {correct}/{total} đúng
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Xuất sắc! Bạn đã nắm vững cách chuyển câu thành W-Fragen.
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Badge variant="secondary" className="text-lg px-4 py-2 mb-2">
                    {correct}/{total} đúng
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Hãy xem lại các đáp án đúng và thử lại!
                  </p>
                </div>
              )}
              
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Làm lại bài tập
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
