'use client';

import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { StarRating } from '@/components/ui/star-rating';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ExerciseRatingProps {
  exerciseId: string;
  variant?: 'card' | 'inline' | 'full';
  showForm?: boolean;
}

interface RatingData {
  averageRating: number;
  totalRatings: number;
  userRating: {
    rating: number;
    reason?: string;
  } | null;
}

export function ExerciseRating({ 
  exerciseId, 
  variant = 'inline',
  showForm = false 
}: ExerciseRatingProps) {
  const [ratingData, setRatingData] = useState<RatingData>({
    averageRating: 0,
    totalRatings: 0,
    userRating: null
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(showForm);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reason, setReason] = useState('');

  // 🔧 TEMPORARY: Use test user
  const userId = 'cmf3wfn7m0002bm5kgb1zg7dk'; // user@edu-theme.com

  useEffect(() => {
    fetchRatings();
  }, [exerciseId]);

  const fetchRatings = async () => {
    try {
      const response = await fetch(
        `/api/exercise-ratings?exerciseId=${encodeURIComponent(exerciseId)}&userId=${userId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setRatingData(data);
        if (data.userRating) {
          setSelectedRating(data.userRating.rating);
          setReason(data.userRating.reason || '');
        }
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (selectedRating === 0) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/exercise-ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId,
          userId,
          rating: selectedRating,
          reason: reason.trim() || null
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRatingData({
          averageRating: data.averageRating,
          totalRatings: data.totalRatings,
          userRating: {
            rating: selectedRating,
            reason: reason.trim() || undefined
          }
        });
        setShowRatingForm(false);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-1 text-gray-400">
        <Star className="w-4 h-4 animate-pulse" />
        <span className="text-sm">Đang tải...</span>
      </div>
    );
  }

  // Inline variant (for card list)
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-1.5">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">
          {ratingData.averageRating > 0 ? ratingData.averageRating.toFixed(1) : '0.0'}
        </span>
        <span className="text-xs text-gray-500">
          ({ratingData.totalRatings})
        </span>
      </div>
    );
  }

  // Card variant (for detail page - compact)
  if (variant === 'card') {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold">
                  {ratingData.averageRating > 0 ? ratingData.averageRating.toFixed(1) : '0.0'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {ratingData.totalRatings} đánh giá
              </p>
            </div>
            {!ratingData.userRating && (
              <Button
                onClick={() => setShowRatingForm(!showRatingForm)}
                variant="outline"
                size="sm"
              >
                Đánh giá
              </Button>
            )}
          </div>

          {ratingData.userRating && (
            <div className="py-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Đánh giá của bạn:
              </p>
              <StarRating rating={ratingData.userRating.rating} readonly size="sm" />
              {ratingData.userRating.reason && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 italic">
                  "{ratingData.userRating.reason}"
                </p>
              )}
              <Button
                onClick={() => setShowRatingForm(true)}
                variant="ghost"
                size="sm"
                className="mt-2"
              >
                Sửa đánh giá
              </Button>
            </div>
          )}

          {showRatingForm && (
            <div className="py-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Chọn số sao:
                </label>
                <StarRating
                  rating={selectedRating}
                  onRatingChange={setSelectedRating}
                  size="md"
                  showLabel
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Lý do (tùy chọn):
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Chia sẻ ý kiến của bạn về bài tập này..."
                  rows={3}
                  className="text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitRating}
                  disabled={selectedRating === 0 || submitting}
                  size="sm"
                >
                  {submitting ? 'Đang gửi...' : ratingData.userRating ? 'Cập nhật' : 'Gửi đánh giá'}
                </Button>
                {showRatingForm && !ratingData.userRating && (
                  <Button
                    onClick={() => setShowRatingForm(false)}
                    variant="ghost"
                    size="sm"
                  >
                    Hủy
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Full variant (for detail page - expanded)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">Đánh giá bài tập</h3>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-xl font-bold">
              {ratingData.averageRating > 0 ? ratingData.averageRating.toFixed(1) : '0.0'}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({ratingData.totalRatings} đánh giá)
            </span>
          </div>
        </div>
      </div>

      {ratingData.userRating ? (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm font-medium mb-2">Đánh giá của bạn:</p>
          <StarRating rating={ratingData.userRating.rating} readonly />
          {ratingData.userRating.reason && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 italic">
              "{ratingData.userRating.reason}"
            </p>
          )}
          <Button
            onClick={() => setShowRatingForm(!showRatingForm)}
            variant="outline"
            size="sm"
            className="mt-3"
          >
            {showRatingForm ? 'Đóng' : 'Sửa đánh giá'}
          </Button>
        </div>
      ) : (
        <Button onClick={() => setShowRatingForm(!showRatingForm)} variant="outline">
          {showRatingForm ? 'Đóng form' : 'Đánh giá bài tập này'}
        </Button>
      )}

      {showRatingForm && (
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Chọn số sao:
            </label>
            <StarRating
              rating={selectedRating}
              onRatingChange={setSelectedRating}
              size="lg"
              showLabel
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Lý do (tùy chọn):
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Chia sẻ ý kiến của bạn về bài tập này..."
              rows={4}
            />
          </div>
          <Button
            onClick={handleSubmitRating}
            disabled={selectedRating === 0 || submitting}
          >
            {submitting ? 'Đang gửi...' : ratingData.userRating ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
          </Button>
        </div>
      )}
    </div>
  );
}
