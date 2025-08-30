"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, RotateCcw, Shuffle, ArrowRight } from 'lucide-react';

interface MatchItem {
  id: string;
  left: string;
  right: string;
  explanation?: string;
}

interface MatchingExerciseProps {
  title?: string;
  items: MatchItem[];
  leftColumnTitle?: string;
  rightColumnTitle?: string;
}

export default function MatchingExercise({ 
  title, 
  items, 
  leftColumnTitle = "Tiếng Đức",
  rightColumnTitle = "Tiếng Việt"
}: MatchingExerciseProps) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [shuffledRightItems, setShuffledRightItems] = useState<{id: string, right: string}[]>([]);

  // Khởi tạo danh sách phải đã shuffle
  React.useEffect(() => {
    const rightItems = items.map(item => ({
      id: item.id,
      right: item.right
    }));
    setShuffledRightItems([...rightItems].sort(() => Math.random() - 0.5));
  }, [items]);

  const handleLeftClick = (leftId: string) => {
    if (showFeedback) return;
    setSelectedLeft(leftId);
  };

  const handleRightClick = (rightId: string) => {
    if (showFeedback || !selectedLeft) return;
    
    // Xóa match cũ nếu có
    const newMatches = { ...matches };
    Object.keys(newMatches).forEach(key => {
      if (newMatches[key] === rightId) {
        delete newMatches[key];
      }
    });
    
    newMatches[selectedLeft] = rightId;
    setMatches(newMatches);
    setSelectedLeft(null);
  };

  const handleCheck = () => {
    setShowFeedback(true);
  };

  const handleReset = () => {
    setMatches({});
    setSelectedLeft(null);
    setShowFeedback(false);
    // Shuffle lại
    setShuffledRightItems([...shuffledRightItems].sort(() => Math.random() - 0.5));
  };

  const handleShuffle = () => {
    if (showFeedback) return;
    setShuffledRightItems([...shuffledRightItems].sort(() => Math.random() - 0.5));
  };

  const correctCount = items.reduce((count, item) => {
    return matches[item.id] === item.id ? count + 1 : count;
  }, 0);

  const scorePercentage = items.length > 0 ? (correctCount / items.length) * 100 : 0;
  
  const getScoreColor = () => {
    if (scorePercentage >= 80) return 'text-green-600';
    if (scorePercentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchStatus = (leftId: string) => {
    const rightId = matches[leftId];
    if (!rightId) return 'unmatched';
    return rightId === leftId ? 'correct' : 'incorrect';
  };

  const isRightItemMatched = (rightId: string) => {
    return Object.values(matches).includes(rightId);
  };

  return (
    <Card className="my-6 border-2 border-green-100">
      <CardHeader className="bg-green-50">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <ArrowRight className="w-5 h-5" />
          {title || 'Bài tập ghép cặp'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Cột trái */}
          <div>
            <h4 className="font-semibold mb-3 text-center text-gray-700">
              {leftColumnTitle}
            </h4>
            <div className="space-y-2">
              {items.map((item) => {
                const status = getMatchStatus(item.id);
                const isSelected = selectedLeft === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLeftClick(item.id)}
                    disabled={showFeedback}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      showFeedback
                        ? status === 'correct'
                          ? 'border-green-500 bg-green-50'
                          : status === 'incorrect'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : matches[item.id]
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.left}</span>
                      {showFeedback && (
                        <span>
                          {status === 'correct' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : status === 'incorrect' ? (
                            <XCircle className="w-5 h-5 text-red-600" />
                          ) : null}
                        </span>
                      )}
                    </div>
                    
                    {/* Hiển thị đáp án đúng khi sai */}
                    {showFeedback && status === 'incorrect' && (
                      <div className="mt-2 text-sm text-green-600 font-medium">
                        Đáp án đúng: {item.right}
                      </div>
                    )}
                    
                    {/* Hiển thị giải thích */}
                    {showFeedback && status === 'correct' && item.explanation && (
                      <div className="mt-2 text-sm text-gray-600 italic">
                        {item.explanation}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cột phải */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700">
                {rightColumnTitle}
              </h4>
              {!showFeedback && (
                <Button
                  onClick={handleShuffle}
                  variant="outline"
                  size="sm"
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {shuffledRightItems.map((item) => {
                const isMatched = isRightItemMatched(item.id);
                const isCorrectMatch = showFeedback && matches && Object.entries(matches).some(
                  ([leftId, rightId]) => rightId === item.id && leftId === rightId
                );
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleRightClick(item.id)}
                    disabled={showFeedback || isMatched}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      showFeedback
                        ? isCorrectMatch
                          ? 'border-green-500 bg-green-50'
                          : isMatched
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                        : isMatched
                        ? 'border-purple-300 bg-purple-50 cursor-default'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.right}</span>
                      {showFeedback && isCorrectMatch && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {showFeedback && isMatched && !isCorrectMatch && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hướng dẫn */}
        {!showFeedback && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Hướng dẫn:</strong> Nhấn vào từ ở cột trái, sau đó nhấn vào từ tương ứng ở cột phải để ghép cặp.
            </p>
          </div>
        )}

        {/* Nút điều khiển */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleCheck}
            className="bg-green-600 hover:bg-green-700"
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
          <div className="bg-gray-50 p-4 rounded-lg border mt-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                Kết quả: <span className={getScoreColor()}>
                  {correctCount}/{items.length} ({scorePercentage.toFixed(0)}%)
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
