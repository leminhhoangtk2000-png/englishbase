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
    
    // Shuffle lại cột phải
    const rightItems = items.map(item => ({
      id: item.id,
      right: item.right
    }));
    setShuffledRightItems([...rightItems].sort(() => Math.random() - 0.5));
  };

  const handleShuffle = () => {
    const rightItems = items.map(item => ({
      id: item.id,
      right: item.right
    }));
    setShuffledRightItems([...rightItems].sort(() => Math.random() - 0.5));
  };

  const correctCount = items.reduce((count, item) => {
    return matches[item.id] === item.id ? count + 1 : count;
  }, 0);

  const scorePercentage = items.length > 0 ? (correctCount / items.length) * 100 : 0;
  
  const getScoreColor = () => {
    if (scorePercentage >= 80) return 'text-green-600 dark:text-green-400';
    if (scorePercentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
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
    <Card className="my-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          {title || 'Bài tập ghép cặp'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 bg-white dark:bg-gray-900">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Cột trái */}
          <div>
            <h4 className="font-semibold mb-3 text-center text-gray-700 dark:text-gray-300">
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
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : status === 'incorrect'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : matches[item.id]
                        ? 'border-purple-300 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.left}</span>
                      {showFeedback && (
                        <span>
                          {status === 'correct' ? (
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : status === 'incorrect' ? (
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                          ) : null}
                        </span>
                      )}
                    </div>
                    
                    {/* Hiển thị đáp án đúng khi sai */}
                    {showFeedback && status === 'incorrect' && (
                      <div className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                        Đáp án đúng: {item.right}
                      </div>
                    )}
                    
                    {/* Hiển thị giải thích */}
                    {showFeedback && status === 'correct' && item.explanation && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
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
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                {rightColumnTitle}
              </h4>
              {!showFeedback && (
                <Button
                  onClick={handleShuffle}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : isMatched
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                        : isMatched
                        ? 'border-purple-300 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20 cursor-default'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.right}</span>
                      {showFeedback && isCorrectMatch && (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      )}
                      {showFeedback && isMatched && !isCorrectMatch && (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
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
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Hướng dẫn:</strong> Nhấn vào từ ở cột trái, sau đó nhấn vào từ tương ứng ở cột phải để ghép cặp.
            </p>
          </div>
        )}

        {/* Nút điều khiển */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
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
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Kết quả: <span className={getScoreColor()}>
                  {correctCount}/{items.length} ({scorePercentage.toFixed(0)}%)
                </span>
              </p>
              
              {scorePercentage >= 80 && (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5 mr-1" />
                  <span className="font-medium">Xuất sắc!</span>
                </div>
              )}
              
              {scorePercentage >= 60 && scorePercentage < 80 && (
                <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                  <span className="font-medium">Khá tốt!</span>
                </div>
              )}
              
              {scorePercentage < 60 && (
                <div className="flex items-center text-red-600 dark:text-red-400">
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
