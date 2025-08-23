'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCommit, GitMerge, Lock, MapPin, Smile, Users, Star, Book, GitBranch, BookMarked, Link as LinkIcon, Twitter, Linkedin, Trash2, Pencil, X, BookOpen, ClipboardCheck, Coffee, Heart, Rocket, Check, Target, Quote } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        <h3 className="text-base mb-4">Số ngày đã học chăm chỉ trong năm {selectedYear}: <span className="font-bold">{days.filter(d => d > 0).length}</span></h3>
        
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
                  className={`w-2.5 h-2.5 rounded-sm ${contributionColors[level]}`}
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
              <div key={index} className={`w-2.5 h-2.5 rounded-sm ${color}`} />
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
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle submission logic here
        console.log({ rating, review });
        setSubmitted(true);
    };

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
                    <Button size="sm" type="submit" disabled={rating === 0 || review.trim() === ""}>Gửi đánh giá</Button>
                </CardFooter>
            </form>
        </Card>
    );
}

function LearningGoal() {
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
                <div className="space-y-4">
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
                    <Separator />
                    <div className="text-sm">
                        <span className="text-muted-foreground">Trình độ hiện tại của bạn:</span>
                        <p className="font-semibold text-lg text-primary">B1 - Trung cấp</p>
                        <p className="text-xs text-muted-foreground">(Dựa trên kết quả bài kiểm tra ngày 29/08/2024)</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function UserPremiumPage() {
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
              <TabsTrigger value="support" className="flex items-center gap-1.5 font-semibold text-foreground">
                <Star className="w-4 h-4" />
                Trở thành người hỗ trợ
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <ContributionGraph />
              
              <LearningGoal />

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
            <TabsContent value="support">
                 <div className="space-y-8">
                    <Card className="bg-secondary/50 border-border/80">
                        <CardContent className="p-6 relative">
                            <Quote className="absolute top-2 left-2 w-8 h-8 text-border" />
                             <div className="space-y-4 text-sm text-muted-foreground text-center max-w-3xl mx-auto py-4">
                                <p>
                                    Chào các bạn, Về cơ bản bọn mình tính được chi phí cho mỗi người dùng trên tháng là <strong className="text-foreground">5.000đ</strong> thôi. Nhưng để tăng cao trải nghiệm bọn mình có tạo thêm một phần tracking việc học của các bạn. Việc này sẽ tốn khá nhiều dung lượng và dữ liệu máy chủ. Nhưng trung bình mỗi bạn cũng chỉ tiêu tốn hết <strong className="text-foreground">20.000đ</strong> chi phí sử dụng nếu sử dụng thêm phần mở rộng.
                                </p>
                                <p>
                                    Đó là lý do bọn mình có gói người hỗ trợ <strong className="text-foreground">25.000đ</strong>. Nếu các bạn sử dụng gói hỗ trợ này, đồng nghĩa với việc các bạn đang giúp bọn mình <strong className="text-foreground">cover chi phí cho một bạn học khác</strong>.
                                </p>
                                <p className="font-semibold text-foreground italic text-base py-2">
                                    "Kiến thức là miễn phí, và bọn mình tin chắc việc làm của chúng ta là có ý nghĩa và sẽ ý nghĩa hơn từng ngày."
                                </p>
                                <p>
                                    Về cơ bản nếu bạn ủng hộ 49.000đ, 99.000đ hay 25.000đ thì <strong className="text-foreground">chất lượng trải nghiệm cũng sẽ như nhau</strong>. Vì vậy hãy <strong className="text-foreground">cân nhắc kỹ khi hỗ trợ</strong> nhé. Bọn mình sẽ <strong className="text-foreground">không thu phí theo hình thức subscription</strong>, đây là khoản phí <strong className="text-foreground">trả một lần</strong>, để tránh việc các bạn quên và khoản phí sẽ tự động gia hạn.
                                </p>
                            </div>
                            <Quote className="absolute bottom-2 right-2 w-8 h-8 text-border rotate-180" />
                        </CardContent>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="flex flex-col">
                            <CardHeader className="items-center">
                                <Coffee className="w-10 h-10 mb-4 text-primary" />
                                <CardTitle>Người hỗ trợ Đồng</CardTitle>
                                <p className="text-2xl font-bold">25.000đ</p>
                                <p className="text-sm text-muted-foreground">/ một lần</p>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Huy hiệu "Người hỗ trợ" đặc biệt.</li>
                                    <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Bạn đang giúp đỡ 1 bạn học.</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" asChild>
                                    <Link href="/payment?tier=bronze">Hỗ trợ</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                         <Card className="flex flex-col border-primary shadow-lg">
                            <CardHeader className="items-center">
                                <Heart className="w-10 h-10 mb-4 text-primary" />
                                <CardTitle>Người hỗ trợ Bạc</CardTitle>
                                 <p className="text-2xl font-bold">49.000đ</p>
                                <p className="text-sm text-muted-foreground">/ một lần</p>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                 <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Huy hiệu "Người hỗ trợ" đặc biệt.</li>
                                    <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Bạn đang giúp đỡ 6 bạn học.</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" asChild>
                                    <Link href="/payment?tier=silver">Hỗ trợ</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                         <Card className="flex flex-col">
                            <CardHeader className="items-center">
                                <Rocket className="w-10 h-10 mb-4 text-primary" />
                                <CardTitle>Người hỗ trợ Vàng</CardTitle>
                                 <p className="text-2xl font-bold">99.000đ</p>
                                <p className="text-sm text-muted-foreground">/ một lần</p>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Huy hiệu "Người hỗ trợ" đặc biệt.</li>
                                    <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Bạn đang giúp đỡ 14 bạn học khác và cả team Deutsch.vn.</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                               <Button className="w-full" asChild>
                                    <Link href="/payment?tier=gold">Hỗ trợ</Link>
                               </Button>
                            </CardFooter>
                        </Card>
                    </div>
                    <p className="text-center text-sm text-muted-foreground italic mt-8 max-w-2xl mx-auto">
                      Ngoài tiếng Đức, bọn mình đã và đang xây dựng team để có thể <strong className="text-foreground">xây dựng thêm nền tảng học tiếng Anh miễn phí</strong>. Vì vậy <strong className="text-foreground">kinh phí là một khoản thật sự cần thiết</strong>.
                      <br />
                      <strong className="text-foreground">Rất cảm ơn vì sự ủng hộ của các bạn!</strong>
                    </p>
                </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
