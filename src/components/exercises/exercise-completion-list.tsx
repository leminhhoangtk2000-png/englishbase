'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, TrendingUp, BookOpen, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CompletionItem {
  id: string;
  exerciseId: string;
  completedAt: string;
  timeSpent: number | null;
  attempts: number;
}

interface CompletionStats {
  totalCompleted: number;
  levelBreakdown: {
    a1: number;
    a2: number;
    b1: number;
    b2: number;
  };
}

interface CompletionData {
  completions: CompletionItem[];
  stats: CompletionStats;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export function ExerciseCompletionList() {
  const [data, setData] = useState<CompletionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    fetchCompletions();
  }, [selectedLevel]);

  const fetchCompletions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedLevel !== 'all') {
        params.append('level', selectedLevel);
      }
      params.append('limit', '20');

      const response = await fetch(`/api/exercise-completion/list?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching completions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getLevelColor = (exerciseId: string) => {
    if (exerciseId.startsWith('a1')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (exerciseId.startsWith('a2')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (exerciseId.startsWith('b1')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    if (exerciseId.startsWith('b2')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getExerciseTitle = (exerciseId: string) => {
    // Convert exercise ID back to readable format
    return exerciseId
      .replace(/-/g, ' ')
      .split('/')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' › ');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Không thể tải dữ liệu hoàn thành.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Tổng hoàn thành</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {data.stats.totalCompleted}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">A1</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {data.stats.levelBreakdown.a1}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">A2</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {data.stats.levelBreakdown.a2}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">B1+</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {data.stats.levelBreakdown.b1 + data.stats.levelBreakdown.b2}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Level Filter */}
      <Tabs value={selectedLevel} onValueChange={setSelectedLevel}>
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="a1">A1</TabsTrigger>
          <TabsTrigger value="a2">A2</TabsTrigger>
          <TabsTrigger value="b1">B1</TabsTrigger>
          <TabsTrigger value="b2">B2</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedLevel} className="space-y-3">
          {data.completions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedLevel === 'all' 
                    ? 'Bạn chưa hoàn thành bài tập nào.'
                    : `Bạn chưa hoàn thành bài tập ${selectedLevel.toUpperCase()} nào.`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {data.completions.map((completion) => (
                <Card key={completion.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <Badge className={getLevelColor(completion.exerciseId)}>
                            {completion.exerciseId.split('/')[0].toUpperCase()}
                          </Badge>
                        </div>
                        
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          <a 
                            href={`/exercises/${completion.exerciseId}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {getExerciseTitle(completion.exerciseId)}
                          </a>
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(completion.completedAt)}
                          </div>
                          
                          {completion.timeSpent && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(completion.timeSpent)}
                            </div>
                          )}
                          
                          {completion.attempts > 1 && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {completion.attempts} lần
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <a href={`/exercises/${completion.exerciseId}`}>
                          Xem lại
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {data.pagination.hasMore && (
                <div className="text-center">
                  <Button variant="outline" onClick={() => fetchCompletions()}>
                    Tải thêm
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
