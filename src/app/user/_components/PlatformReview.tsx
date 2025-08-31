'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Check, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import * as React from 'react';

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

            if (response.ok) {
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
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    setSubmitted(false);
                }, 3000);
            } else {
                if (response.status === 429) {
                    // Cooldown active
                    setCooldownInfo({
                        active: true,
                        remainingDays: data.remainingDays || 365,
                        nextAllowedDate: new Date(data.nextAllowedDate)
                    });
                }
                alert(data.message || data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    // If cooldown is active, show countdown
    if (cooldownInfo?.active) {
        return (
            <Card>
                <CardHeader className="p-4 items-center text-center">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Đã gửi đánh giá
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Bạn đã gửi đánh giá thành công!
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "w-4 h-4",
                                        star <= rating
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-muted-foreground/50"
                                    )}
                                />
                            ))}
                        </div>
                        <p className="text-sm italic text-muted-foreground mb-4">
                            "{review}"
                        </p>
                        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                Bạn có thể gửi đánh giá mới sau <strong>{cooldownInfo.remainingDays} ngày</strong>
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                Ngày có thể gửi tiếp: {cooldownInfo.nextAllowedDate?.toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (submitted) {
        return (
            <Card>
                <CardHeader className="p-4 items-center text-center">
                    <CardTitle className="text-base">Cảm ơn bạn!</CardTitle>
                    <CardDescription className="text-xs">
                        Chúng tôi đã nhận được đánh giá của bạn.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex justify-center">
                    <Check className="w-10 h-10 text-green-500" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-base">Đánh giá nền tảng</CardTitle>
                <CardDescription className="text-xs">
                    Những góp ý của bạn sẽ giúp chúng tôi cải thiện.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="p-4 pt-0 space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs">Bạn xếp hạng chúng tôi thế nào?</Label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "w-6 h-6 cursor-pointer transition-colors",
                                        (hoverRating >= star || rating >= star)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-muted-foreground/50"
                                    )}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="review-text" className="text-xs">Nhận xét của bạn</Label>
                        <Textarea
                            id="review-text"
                            placeholder="Hãy cho chúng tôi biết suy nghĩ của bạn..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            rows={3}
                            className="text-sm"
                        />
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                    <Button 
                        size="sm" 
                        type="submit" 
                        disabled={rating === 0 || review.trim() === "" || loading}
                        className="w-full"
                    >
                        {loading ? "Đang gửi..." : existingReview ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
