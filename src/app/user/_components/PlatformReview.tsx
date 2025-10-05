'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Check, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import React from 'react';

export function PlatformReview() {
    const { user } = useAuth();
    const [rating, setRating] = React.useState(0);
    const [hoverRating, setHoverRating] = React.useState(0);
    const [review, setReview] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [existingReview, setExistingReview] = React.useState<any>(null);
    const [cooldownInfo, setCooldownInfo] = React.useState<any>(null);

    // Load existing review
    React.useEffect(() => {
        const loadReview = async () => {
            try {
                if (user) {
                    const response = await fetch(`/api/reviews?userId=${user.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.review) {
                            setExistingReview(data.review);
                            setRating(data.review.rating);
                            setReview(data.review.comment);
                            
                            // Check cooldown
                            if (data.review.nextAllowedDate) {
                                const nextAllowed = new Date(data.review.nextAllowedDate);
                                const now = new Date();
                                if (nextAllowed > now) {
                                    const remainingDays = Math.ceil((nextAllowed.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                    setCooldownInfo({
                                        active: true,
                                        remainingDays,
                                        nextAllowedDate: nextAllowed
                                    });
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading review:', error);
            }
        };
        
        loadReview();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (rating === 0) {
            alert('Vui lòng chọn số sao đánh giá');
            return;
        }
        
        if (review.trim().length < 10) {
            alert('Vui lòng viết ít nhất 10 ký tự');
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
                }),
            });

            const data = await response.json();
            console.log('Review response:', { status: response.status, data });

            if (response.ok) {
                console.log('✅ Review submitted successfully!');
                setSubmitted(true);
                setExistingReview(data.review);
                
                // Set new cooldown
                if (data.review.nextAllowedDate) {
                    const nextAllowed = new Date(data.review.nextAllowedDate);
                    const remainingDays = Math.ceil((nextAllowed.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    setCooldownInfo({
                        active: true,
                        remainingDays,
                        nextAllowedDate: nextAllowed
                    });
                }
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

    // Show existing review if user has already submitted
    if (existingReview && !submitted) {
        return (
            <Card className="border-0 shadow-none bg-green-50/50 dark:bg-green-950/20">
                <CardHeader className="text-center pb-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-lg font-bold text-green-800 dark:text-green-200">
                        Cảm ơn đánh giá của bạn!
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                    {/* Rating Display */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                        i < existingReview.rating 
                                            ? 'text-yellow-400 fill-current' 
                                            : 'text-gray-300'
                                    }`}
                                />
                            ))}
                            <span className="ml-2 font-bold text-base">{existingReview.rating}/5</span>
                        </div>
                    </div>

                    {/* Review Quote */}
                    <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg border-0">
                        <p className="text-center italic text-gray-700 dark:text-gray-300 text-sm">
                            "{existingReview.comment}"
                        </p>
                    </div>

                    {/* Cooldown Timer */}
                    {cooldownInfo?.active && (
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border-0 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold text-blue-800 dark:text-blue-200 text-sm">
                                    Thời gian chờ đánh giá tiếp theo
                                </span>
                            </div>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                Bạn có thể gửi đánh giá mới sau <span className="font-bold">{cooldownInfo.remainingDays} ngày</span>
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                🗓️ Thứ Hai, 31 tháng 8, 2026
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    // Show success message after submitting
    if (submitted) {
        return (
            <Card className="border-0 shadow-none bg-green-50/50 dark:bg-green-950/20">
                <CardHeader className="text-center pb-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-lg font-bold text-green-800 dark:text-green-200">
                        Cảm ơn đánh giá của bạn!
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg border-0 text-center">
                        <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                            💝 Góp ý của bạn giúp chúng tôi phát triển tốt hơn
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Show review form
    return (
        <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Đánh giá nền tảng</CardTitle>
                <CardDescription className="text-sm">
                    Chia sẻ ý kiến của bạn để giúp chúng tôi cải thiện
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-3 pt-0">
                    <div className="space-y-2">
                        <Label className="text-sm">Đánh giá sao</Label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "w-5 h-5 cursor-pointer transition-colors",
                                        (hoverRating >= star || rating >= star)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300 hover:text-yellow-300"
                                    )}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="review" className="text-sm">Nhận xét</Label>
                        <Textarea
                            id="review"
                            placeholder="Chia sẻ trải nghiệm của bạn..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            rows={3}
                            className="text-sm"
                        />
                        <div className="text-right text-xs text-muted-foreground">
                            {review.length}/10 ký tự tối thiểu
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-0">
                    <Button 
                        type="submit" 
                        disabled={rating === 0 || review.trim().length < 10 || loading}
                        className="w-full"
                        size="sm"
                    >
                        {loading ? "Đang gửi..." : existingReview ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
