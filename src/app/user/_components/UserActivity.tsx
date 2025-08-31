import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TimelineItem } from "./TimelineItem";
import { Check, BookOpen, ClipboardCheck } from "lucide-react";

const userActivity = [
    {
        type: 'completed_exercise',
        title: 'Bài tập về Thì hiện tại đơn',
        date: '22 tháng 8',
        score: '9/10',
    },
    {
        type: 'read_blog',
        title: '8 Apps to Use Instead of Doomscrolling on Your iPhone',
        date: '21 tháng 8',
    },
    {
        type: 'read_blog',
        title: 'A Guide to Component-Based Documentation',
        date: '20 tháng 8',
    },
    {
        type: 'completed_exercise',
        title: 'Bài tập về Giới từ',
        date: '19 tháng 8',
        score: '7/10',
    }
];

export function UserActivity() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Hoạt động gần đây</CardTitle>
                <CardDescription>
                    Theo dõi quá trình học tập của bạn.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-0">
                {userActivity.map((activity, index) => (
                    <TimelineItem
                        key={index}
                        icon={
                            activity.type === 'completed_exercise' ? (
                                <ClipboardCheck className="w-4 h-4 text-green-600" />
                            ) : (
                                <BookOpen className="w-4 h-4 text-blue-600" />
                            )
                        }
                        isLast={index === userActivity.length - 1}
                    >
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {activity.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {activity.date}
                                </p>
                            </div>
                            {activity.score && (
                                <Badge variant="secondary" className="ml-2">
                                    {activity.score}
                                </Badge>
                            )}
                        </div>
                    </TimelineItem>
                ))}
            </CardContent>
        </Card>
    );
}
