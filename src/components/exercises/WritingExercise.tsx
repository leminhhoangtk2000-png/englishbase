"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, RotateCcw, Edit3, Volume2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface WritingPrompt {
  question: string;
  minWords?: number;
  maxWords?: number;
  sampleAnswer?: string;
  hints?: string[];
  keywords?: string[];
}

interface WritingExerciseProps {
  title?: string;
  prompt: WritingPrompt;
}

export default function WritingExercise({ title, prompt }: WritingExerciseProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSample, setShowSample] = useState(false);

  const wordCount = userAnswer.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  const handleCheck = () => {
    setShowFeedback(true);
  };

  const handleReset = () => {
    setUserAnswer('');
    setShowFeedback(false);
    setShowSample(false);
  };

  const toggleSample = () => {
    setShowSample(!showSample);
  };

  const getWordCountStatus = () => {
    if (!prompt.minWords && !prompt.maxWords) return 'normal';
    
    if (prompt.minWords && wordCount < prompt.minWords) return 'too-short';
    if (prompt.maxWords && wordCount > prompt.maxWords) return 'too-long';
    return 'good';
  };

  const getWordCountColor = () => {
    const status = getWordCountStatus();
    switch (status) {
      case 'too-short': return 'text-red-600 dark:text-red-400';
      case 'too-long': return 'text-orange-600 dark:text-orange-400';
      case 'good': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const checkKeywordUsage = () => {
    if (!prompt.keywords) return [];
    
    const lowerAnswer = userAnswer.toLowerCase();
    return prompt.keywords.map(keyword => ({
      keyword,
      used: lowerAnswer.includes(keyword.toLowerCase())
    }));
  };

  const keywordUsage = checkKeywordUsage();
  const usedKeywords = keywordUsage.filter(k => k.used).length;

  return (
    <Card className="my-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          {title || 'Bài tập viết'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 bg-white dark:bg-gray-900">
        {/* Câu hỏi */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
            {prompt.question}
          </h4>
          
          {/* Yêu cầu độ dài */}
          {(prompt.minWords || prompt.maxWords) && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Yêu cầu độ dài:</strong> {' '}
              {prompt.minWords && prompt.maxWords 
                ? `${prompt.minWords}-${prompt.maxWords} từ`
                : prompt.minWords 
                ? `Tối thiểu ${prompt.minWords} từ`
                : `Tối đa ${prompt.maxWords} từ`
              }
            </div>
          )}
          
          {/* Từ khóa cần sử dụng */}
          {prompt.keywords && prompt.keywords.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Từ khóa cần sử dụng:</strong> {prompt.keywords.join(', ')}
            </div>
          )}
        </div>

        {/* Gợi ý */}
        {prompt.hints && prompt.hints.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Gợi ý:</h5>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              {prompt.hints.map((hint, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Ô nhập văn bản */}
        <div className="mb-4">
          <Textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Viết câu trả lời của bạn ở đây..."
            className="min-h-32 resize-y bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            disabled={showFeedback}
          />
          
          {/* Đếm từ */}
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className={getWordCountColor()}>
              Số từ: {wordCount}
              {prompt.minWords && wordCount < prompt.minWords && (
                <span className="ml-2">(Cần thêm {prompt.minWords - wordCount} từ)</span>
              )}
              {prompt.maxWords && wordCount > prompt.maxWords && (
                <span className="ml-2">(Vượt quá {wordCount - prompt.maxWords} từ)</span>
              )}
            </span>
            
            {/* Hiển thị từ khóa đã sử dụng */}
            {prompt.keywords && prompt.keywords.length > 0 && (
              <span className="text-gray-600 dark:text-gray-400">
                Từ khóa đã dùng: {usedKeywords}/{prompt.keywords.length}
              </span>
            )}
          </div>
        </div>

        {/* Kiểm tra từ khóa */}
        {showFeedback && prompt.keywords && prompt.keywords.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800">
            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Kiểm tra từ khóa:</h5>
            <div className="flex flex-wrap gap-2">
              {keywordUsage.map((item, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded text-sm ${
                    item.used
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700'
                  }`}
                >
                  {item.keyword} {item.used ? '✓' : '✗'}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Nút điều khiển */}
        <div className="flex gap-3 mb-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            onClick={handleCheck}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
            disabled={showFeedback || userAnswer.trim().length === 0}
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
          
          {prompt.sampleAnswer && (
            <Button
              onClick={toggleSample}
              variant="outline"
              className="ml-auto border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {showSample ? 'Ẩn' : 'Xem'} mẫu
            </Button>
          )}
        </div>

        {/* Đánh giá */}
        {showFeedback && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <h5 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Đánh giá:</h5>
            
            {/* Đánh giá độ dài */}
            <div className="mb-2">
              <span className="font-medium">Độ dài: </span>
              <span className={getWordCountColor()}>
                {(() => {
                  const status = getWordCountStatus();
                  switch (status) {
                    case 'too-short': return 'Cần viết thêm';
                    case 'too-long': return 'Hơi dài, nên rút gọn';
                    case 'good': return 'Phù hợp';
                    default: return 'Tốt';
                  }
                })()}
              </span>
            </div>
            
            {/* Đánh giá từ khóa */}
            {prompt.keywords && prompt.keywords.length > 0 && (
              <div className="mb-2">
                <span className="font-medium">Từ khóa: </span>
                <span className={usedKeywords === prompt.keywords.length ? 'text-green-600' : 'text-yellow-600'}>
                  {usedKeywords === prompt.keywords.length 
                    ? 'Đã sử dụng đầy đủ từ khóa' 
                    : `Sử dụng ${usedKeywords}/${prompt.keywords.length} từ khóa`
                  }
                </span>
              </div>
            )}
            
            <div className="text-green-600 dark:text-green-400 font-medium">
              ✓ Bài viết đã được hoàn thành
            </div>
          </div>
        )}

        {/* Câu trả lời mẫu */}
        {showSample && prompt.sampleAnswer && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Câu trả lời mẫu:
            </h5>
            <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
              {prompt.sampleAnswer}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
