'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target } from "lucide-react";
import * as React from 'react';

export function LearningGoal() {
    const [goal, setGoal] = React.useState("b1");

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5" />
                    Mục tiêu học tập của bạn
                </CardTitle>
                <CardDescription>
                    Chọn trình độ bạn đang hướng tới để chúng tôi có thể cá nhân hóa trải nghiệm học tập.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <Select value={goal} onValueChange={setGoal}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Chọn mục tiêu..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="a1">Sơ cấp 1 (A1)</SelectItem>
                            <SelectItem value="a2">Sơ cấp 2 (A2)</SelectItem>
                            <SelectItem value="b1">Trung cấp 1 (B1)</SelectItem>
                            <SelectItem value="b2">Trung cấp 2 (B2)</SelectItem>
                            <SelectItem value="c1">Cao cấp 1 (C1)</SelectItem>
                            <SelectItem value="c2">Cao cấp 2 (C2)</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button>Làm bài test</Button>
                </div>
            </CardContent>
        </Card>
    );
}
