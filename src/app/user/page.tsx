
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCommit, GitMerge, Lock, MapPin, Smile, Users, Star, Book, GitBranch, BookMarked, Link as LinkIcon, Twitter, Linkedin, Trash2, Pencil, X, BookOpen, ClipboardCheck } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function ContributionGraph() {
  const [selectedYear, setSelectedYear] = React.useState('2025');
  const [days, setDays] = React.useState<number[]>([]);

  React.useEffect(() => {
    const initialDays = Array.from({ length: 371 }, () => 0);
    const randomDays = initialDays.map(() => {
      if (Math.random() > 0.4) {
        return Math.floor(Math.random() * 4) + 1;
      }
      return 0;
    });
    setDays(randomDays);
  }, [selectedYear]);

  const contributionColors = [
    "bg-gray-100 dark:bg-gray-800",
    "bg-green-500",
    "bg-green-600",
    "bg-green-700",
    "bg-green-800",
  ];
  
  const months = ["Thg1", "Thg2", "Thg3", "Thg4", "Thg5", "Thg6", "Thg7", "Thg8", "Thg9", "Thg10", "Thg11", "Thg12"];
  const years = ['2025', '2024'];
  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];


  return (
    <div className="flex items-start gap-4">
      <div className="p-4 border rounded-md flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-base mb-2">{days.filter(d => d > 0).length} đóng góp trong năm {selectedYear}</h3>
          <Button variant="outline" size="sm" className="text-xs h-7">Cài đặt đóng góp</Button>
        </div>
        
        <div className="flex gap-3">
          <div className="flex flex-col text-xs text-muted-foreground self-stretch pt-6">
            {weekDays.map((day, index) => (
              <span key={day} className={cn("h-3", { "invisible": index % 2 !== 0 })}>
                {day.substring(0,3)}
              </span>
            ))}
          </div>
          
          <div className="w-full">
            <div className="flex justify-between text-xs text-muted-foreground mb-1 px-1">
              {months.map((month) => (
                <div key={month} className="flex-1 text-center">
                  {month}
                </div>
              ))}
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {days.map((level, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 ${contributionColors[level]}`}
                  title={`Mức độ đóng góp ${level} vào ngày ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <Link href="#" className="hover:text-primary">Tìm hiểu cách chúng tôi đếm đóng góp</Link>
          <div className="flex items-center gap-1">
            <span>Ít</span>
            {contributionColors.map((color, index) => (
              <div key={index} className={`w-2.5 h-2.5 ${color}`} />
            ))}
            <span>Nhiều</span>
          </div>
        </div>
      </div>
       <div className="flex flex-col items-start gap-1">
        {years.map(year => (
          <Button 
            key={year}
            variant={selectedYear === year ? 'default' : 'ghost'}
            size="sm"
            className={cn('h-7 px-3 w-full justify-start text-sm', {'text-muted-foreground': selectedYear !== year})}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </Button>
        ))}
       </div>
    </div>
  );
};

const TimelineItem = ({ icon, children, isLast = false }: { icon: React.ReactNode, children: React.ReactNode, isLast?: boolean }) => (
    <div className="relative flex items-start gap-6">
        <div className="flex flex-col items-center">
            <div className="bg-background border rounded-full h-8 w-8 flex items-center justify-center z-10">
                {icon}
            </div>
            {!isLast && <div className="w-px h-full bg-border -mt-1" />}
        </div>
        <div className="pt-1.5 pb-8 w-full">{children}</div>
    </div>
);

const blogPosts = [
  {
    title: "8 Apps to Use Instead of Doomscrolling on Your iPhone",
    date: "Aug 20, 2025",
    status: "published",
  },
  {
    title: "My First Blog Post",
    date: "Aug 15, 2025",
    status: "draft",
  },
  {
    title: "A Guide to Component-Based Documentation",
    date: "Aug 10, 2025",
    status: "published",
  },
];

const savedPosts = [
  {
    author: "Sejalbaranwal",
    title: "I Use These 5 ChatGPT Prompts Daily - You'll Wish You Knew These Sooner",
    image: "https://placehold.co/112x112.png",
    data_ai_hint: "ai prompts",
  },
  {
    author: "Anthony Lam",
    title: "I Tried 19 Side Hustles. Here's What Actually Made Me Money (And What Sucked)",
    image: "https://placehold.co/112x112.png",
    data_ai_hint: "woman laptop",
  },
];

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
]

function PlatformReview() {
    const [rating, setRating] = React.useState(0);
    const [hoverRating, setHoverRating] = React.useState(0);
    const [review, setReview] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle submission logic here
        console.log({ rating, review });
        alert("Cảm ơn bạn đã gửi đánh giá!");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Đánh giá nền tảng</CardTitle>
                <CardDescription>
                    Chúng tôi rất trân trọng những góp ý của bạn để cải thiện Deutsch.vn.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Bạn xếp hạng chúng tôi thế nào?</Label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "w-8 h-8 cursor-pointer transition-colors",
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
                        <Label htmlFor="review-text">Nhận xét của bạn</Label>
                        <Textarea
                            id="review-text"
                            placeholder="Hãy cho chúng tôi biết suy nghĩ của bạn..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            rows={5}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={rating === 0 || review.trim() === ""}>Gửi đánh giá</Button>
                </CardFooter>
            </form>
        </Card>
    );
}

export default function UserPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Left Sidebar */}
        <div className="md:col-span-1">
          <Avatar className="w-full h-auto max-w-[256px] aspect-square rounded-full border-4 border-card mb-4">
            <AvatarImage src="https://placehold.co/256x256.png" data-ai-hint="man portrait" />
            <AvatarFallback>KV</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">Khoa Võ</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-4">khoavo261</p>
          <Button variant="outline" className="w-full mb-4" asChild>
            <Link href="/user/edit">Chỉnh sửa hồ sơ</Link>
          </Button>
          
          <p className="text-sm text-foreground mb-4">
            Lập trình viên phát triển các dự án mã nguồn mở.
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <Link href="#" className="flex items-center gap-1 hover:text-primary">
              <Users className="w-4 h-4" />
              <span className="font-semibold text-foreground">0</span> người theo dõi
            </Link>
            <span>·</span>
            <Link href="#" className="hover:text-primary">
              <span className="font-semibold text-foreground">2</span> đang theo dõi
            </Link>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4"/>
                  <span>Việt Nam</span>
              </div>
               <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4"/>
                  <Link href="#" className="hover:text-primary hover:underline">https://portfolio.example.com</Link>
              </div>
              <div className="flex items-center gap-2">
                  <Twitter className="w-4 h-4"/>
                   <Link href="#" className="hover:text-primary hover:underline">@khoavo_dev</Link>
              </div>
               <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4"/>
                  <Link href="#" className="hover:text-primary hover:underline">linkedin.com/in/khoavo</Link>
              </div>
          </div>

          <div className="mt-8">
            <PlatformReview />
          </div>
        </div>

        {/* Right Content */}
        <div className="md:col-span-3">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="write" asChild>
                <Link href="/blog-new/create">Viết cùng Deutsch.vn</Link>
              </TabsTrigger>
              <TabsTrigger value="manage-blog">Quản lý blog</TabsTrigger>
              <TabsTrigger value="saved-posts">Bài viết đã lưu</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <ContributionGraph />

              <h2 className="text-lg font-semibold mt-8 mb-4">Hoạt động</h2>
              <div className="border-t">
                  <div className="text-center text-sm py-3 border-b">
                      Tháng Tám 2025
                  </div>

                  {userActivity.map((activity, index) => (
                    <TimelineItem 
                      key={index} 
                      icon={activity.type === 'read_blog' ? <BookOpen className="w-4 h-4" /> : <ClipboardCheck className="w-4 h-4" />}
                      isLast={index === userActivity.length - 1}
                    >
                      <div className="flex justify-between items-start text-sm">
                          <p className="text-muted-foreground">
                            {activity.type === 'read_blog' ? 'Đã đọc bài viết ' : 'Đã hoàn thành bài tập '}
                            <Link href="#" className="font-semibold text-foreground hover:underline">{activity.title}</Link>
                            {activity.score && <span> với số điểm <span className="font-semibold text-foreground">{activity.score}</span></span>}
                          </p>
                          <span className="text-muted-foreground flex-shrink-0 ml-4">{activity.date}</span>
                      </div>
                    </TimelineItem>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="manage-blog">
              <Card>
                <div className="p-6">
                  <h2 className="text-2xl font-bold font-headline">Quản lý bài viết</h2>
                  <p className="text-muted-foreground mt-1">Xem, chỉnh sửa hoặc xóa các bài viết của bạn.</p>
                </div>
                <div className="border-t">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60%]">Tiêu đề</TableHead>
                        <TableHead>Ngày đăng</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogPosts.map((post) => (
                        <TableRow key={post.title}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>{post.date}</TableCell>
                          <TableCell>
                            <Badge variant={post.status === "published" ? "default" : "secondary"}>
                              {post.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="saved-posts">
               <Card>
                <div className="p-6">
                  <h2 className="text-2xl font-bold font-headline">Bài viết đã lưu</h2>
                  <p className="text-muted-foreground mt-1">Những bài viết bạn đã lưu để đọc sau.</p>
                </div>
                <div className="border-t">
                    <div className="space-y-6 p-6">
                        {savedPosts.map((post, index) => (
                            <div key={index}>
                                <div className="flex justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center text-sm mb-2">
                                            <Avatar className="h-6 w-6 mr-2">
                                                <AvatarImage src={`https://placehold.co/24x24.png`} alt={post.author} />
                                                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-semibold">{post.author}</span>
                                        </div>
                                        <h3 className="font-bold font-headline text-lg">
                                            <Link href="/blog-new/first-post" className="hover:underline">{post.title}</Link>
                                        </h3>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            width={112}
                                            height={112}
                                            data-ai-hint={post.data_ai_hint}
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                </div>
                                 <div className="flex items-center justify-end mt-2">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                                        <X className="w-4 h-4 mr-1" />
                                        Bỏ lưu
                                    </Button>
                                </div>
                                {index < savedPosts.length - 1 && <Separator className="mt-6" />}
                            </div>
                        ))}
                    </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
