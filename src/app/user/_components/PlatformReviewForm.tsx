'use client';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Check, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import React from 'react';

interface PlatformReviewFormProps {
  onReviewSubmitted?: () => void;
}

export function PlatformReviewForm({ onReviewSubmitted }: PlatformReviewFormProps) {
    const { user } = useAuth();
    const [rating, setRating] = React.useState(0);
    const [hoverRating, setHoverRating] = React.useState(0);
    const [review, setReview] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            alert('Bạn cần đăng nhập để đánh giá');
            return;
        }

        if (rating === 0) {
            alert('Vui lòng chọn số sao đánh giá');
            return;
        }

        if (review.trim().length < 10) {
            alert('Vui lòng viết đánh giá ít nhất 10 ký tự');
            return;
        }

        setLoading(true);
        
        try {
            console.log('Submitting review:', { rating, comment: review });
            
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating,
                    comment: review,
                    title: `Đánh giá ${rating} sao`,
                    userId: user.id
                }),
                credentials: 'include'
            });

            const data = await response.json();
            console.log('Review response:', { status: response.status, data });

            if (response.ok) {
                console.log('✅ Review submitted successfully!');
                setSubmitted(true);
                
                // Call callback to notify parent component
                onReviewSubmitted?.();
            } else {
                console.error('❌ Review submission failed:', data);
                alert(data.error || data.message || 'Có lỗi xảy ra khi gửi đánh giá');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Có lỗi xảy ra khi gửi đánh giá');
        } finally {
            setLoading(false);
        }
    };

    // Show success message after submitting
    if (submitted) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                    Cảm ơn đánh giá của bạn!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    💝 Góp ý của bạn giúp chúng tôi phát triển tốt hơn
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-2">
                <Label className="text-base font-medium">Đánh giá sao</Label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={cn(
                                "p-1 rounded transition-colors",
                                "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                            )}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                className={cn(
                                    "w-8 h-8 transition-colors",
                                    (hoverRating || rating) >= star
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300 dark:text-gray-600"
                                )}
                            />
                        </button>
                    ))}
                </div>
                {rating > 0 && (
                    <p className="text-sm text-muted-foreground">
                        Bạn đã chọn {rating} sao
                    </p>
                )}
            </div>

            {/* Review Text */}
            <div className="space-y-2">
                <Label htmlFor="review" className="text-base font-medium">Nhận xét</Label>
                <Textarea
                    id="review"
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="min-h-[120px] resize-none"
                    maxLength={500}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tối thiểu 10 ký tự</span>
                    <span>{review.length}/500 ký tự</span>
                </div>
            </div>

            {/* Submit Button */}
            <Button 
                type="submit" 
                disabled={loading || rating === 0 || review.trim().length < 10}
                className="w-full"
            >
                {loading ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
        </form>
    );
}
