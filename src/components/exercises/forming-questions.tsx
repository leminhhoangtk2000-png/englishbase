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

export function FormingQuestions({ title, statements, correctQuestions }: FormingQuestionsProps) {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  
  // Use real data
  const testStatements = statements || [];
  const testQuestions = correctQuestions || [];
  
  // Early return if no data
  if (testStatements.length === 0) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50">
        <h3 className="text-lg font-semibold text-red-700">{title || 'FormingQuestions'}</h3>
        <p className="text-red-600 mt-2">Không có statements để hiển thị</p>
        <p className="text-sm text-red-500 mt-1">Debug info: statements.length = {statements?.length || 0}</p>
      </div>
    );
  }



  const handleAnswerChange = (index: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [index]: value
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

  const getAnswerResult = (index: number): 'correct' | 'incorrect' | 'unanswered' => {
    if (!showResults) return 'unanswered';
    
    const userAnswer = answers[index]?.trim().toLowerCase();
    const correctAnswer = testQuestions[index].toLowerCase();
    
    if (!userAnswer) return 'unanswered';
    
    return userAnswer === correctAnswer ? 'correct' : 'incorrect';
  };

  const getScore = (): { correct: number; total: number } => {
    let correct = 0;
    testStatements.forEach((_, index) => {
      if (getAnswerResult(index) === 'correct') {
        correct++;
      }
    });
    return { correct, total: testStatements.length };
  };

  const allAnswered = Object.keys(answers).length === testStatements.length && 
    Object.values(answers).every(answer => answer.trim() !== '');
  
  const { correct, total } = getScore();

  // Extract highlighted parts from statements (text between asterisks)
  const extractHighlight = (statement: string) => {
    const parts = statement.split(/\*([^*]+)\*/);
    return parts.map((part, index) => 
      index % 2 === 1 ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  if (!isStarted) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <p className="text-muted-foreground">
            Chuyển {testStatements.length} câu khẳng định thành câu hỏi W-Fragen
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
    <Card className="w-full max-w-5xl mx-auto">
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
          {testStatements.map((statement, index) => {

            const result = getAnswerResult(index);
            const userAnswer = answers[index] || '';
            
            return (
              <div
                key={index}
                className={`
                  p-4 rounded-lg border transition-all duration-200
                  ${showResults && result === 'correct' ? 'border-green-500 bg-green-50' : ''}
                  ${showResults && result === 'incorrect' ? 'border-red-500 bg-red-50' : ''}
                  ${showResults && result === 'unanswered' ? 'border-yellow-500 bg-yellow-50' : ''}
                  ${!showResults ? 'border-gray-200 hover:border-blue-300' : ''}
                `}
              >
                <div className="space-y-3">
                  {/* Original Statement */}
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-blue-700 min-w-[30px]">
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium text-lg">
                          {extractHighlight(statement)}
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
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
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
                      <div className="min-w-[24px]">
                        {result === 'correct' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : result === 'incorrect' ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  
                  {/* Show correct answer if wrong */}
                  {showResults && result === 'incorrect' && (
                    <div className="ml-8 mt-2 p-2 bg-green-100 rounded border-l-4 border-green-500">
                      <p className="text-sm">
                        <span className="font-medium text-green-700">Đáp án đúng: </span>
                        <span className="text-green-800">{testQuestions[index]}</span>
                      </p>
                    </div>
                  )}
                  
                  {/* Show if correct */}
                  {showResults && result === 'correct' && (
                    <div className="ml-8 mt-2 text-sm text-green-700">
                      ✓ Chính xác!
                    </div>
                  )}
                  
                  {/* Show if unanswered */}
                  {showResults && result === 'unanswered' && (
                    <div className="ml-8 mt-2 p-2 bg-yellow-100 rounded border-l-4 border-yellow-500">
                      <p className="text-sm">
                        <span className="font-medium text-yellow-700">Chưa trả lời. Đáp án: </span>
                        <span className="text-yellow-800">{testQuestions[index]}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 justify-center">
          {!showResults ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!allAnswered}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Kiểm tra ({Object.keys(answers).length}/{testStatements.length})
            </Button>
          ) : (
            <Button 
              onClick={handleReset} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Làm lại
            </Button>
          )}
        </div>

        {showResults && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold mb-2">Thống kê kết quả:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{correct}</div>
                <div className="text-muted-foreground">Đúng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{total - correct}</div>
                <div className="text-muted-foreground">Sai</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((correct / total) * 100)}%
                </div>
                <div className="text-muted-foreground">Điểm số</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{total}</div>
                <div className="text-muted-foreground">Tổng số</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
