
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GitCommit, GitMerge, Lock, MapPin, Smile, Users, Star, Book, GitBranch, BookMarked, Link as LinkIcon, Twitter, Linkedin } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { cn } from "@/lib/utils";

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
          <h3 className="text-base mb-2">202 đóng góp trong năm {selectedYear}</h3>
          <Button variant="outline" size="sm" className="text-xs h-7">Cài đặt đóng góp</Button>
        </div>

        <div className="flex gap-2">
          <div className="flex flex-col text-xs text-muted-foreground self-stretch pt-6">
            {weekDays.map((day, index) => (
              <span key={day} className={cn("h-3", { "invisible": index % 2 !== 0 })}>
                {day.substring(0,3)}
              </span>
            ))}
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                {months.map((month) => (
                  <div key={month} className="flex-shrink-0">
                    {month}
                  </div>
                ))}
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1">
                {days.map((level, index) => (
                    <div
                        key={index}
                        className={`w-2 h-2 ${contributionColors[level]}`}
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
          <Button variant="outline" className="w-full mb-4">Chỉnh sửa hồ sơ</Button>
          
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
        </div>

        {/* Right Content */}
        <div className="md:col-span-3">
            <ContributionGraph />

            <h2 className="text-lg font-semibold mt-8 mb-4">Hoạt động đóng góp</h2>
            <div className="border-t">
                <div className="text-center text-sm py-3 border-b">
                    Tháng Tám 2025
                </div>

                <TimelineItem icon={<GitMerge className="w-4 h-4" />}>
                    <div className="flex justify-between items-center text-sm mb-2">
                        <h3 className="font-semibold">Đã tạo 49 commit trong 2 repository</h3>
                        <GitCommit className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <ul className="space-y-1 text-sm">
                        <li className="flex justify-between items-center">
                            <Link href="#" className="text-primary hover:underline truncate">khoavo261/Bisflow <span className="text-muted-foreground">25 commit</span></Link>
                            <div className="w-24 h-2 bg-green-600 rounded-full" />
                        </li>
                        <li className="flex justify-between items-center">
                            <Link href="#" className="text-primary hover:underline truncate">khoavo261/deutschhub <span className="text-muted-foreground">24 commit</span></Link>
                            <div className="w-24 h-2 bg-green-600 rounded-full" />
                        </li>
                    </ul>
                </TimelineItem>

                <TimelineItem icon={<BookMarked className="w-4 h-4" />}>
                     <div className="flex justify-between items-center text-sm mb-2 text-muted-foreground">
                        <h3 className="font-normal">Đã tạo repository đầu tiên</h3>
                        <span>4 tháng 8</span>
                    </div>
                    <Card className="p-6 text-center bg-card/50">
                        <Image src="https://placehold.co/400x200.png" data-ai-hint="space illustration" width={400} height={200} className="mx-auto mb-4 rounded-md" alt="First repository illustration"/>
                        <p className="font-semibold text-green-400">Repository đầu tiên</p>
                        <h4 className="font-semibold text-lg"><Link href="#" className="text-primary hover:underline">deutschhub</Link> <span className="text-xs border rounded-full px-2 py-0.5 text-muted-foreground">Riêng tư</span></h4>
                        <p className="text-xs text-muted-foreground mt-2">Chỉ những người có thể xem khoavo261/deutschhub mới thấy được đóng góp này</p>
                    </Card>
                </TimelineItem>

                <TimelineItem icon={<GitBranch className="w-4 h-4" />} isLast>
                    <div className="flex justify-between items-center text-sm mb-2">
                        <h3 className="font-semibold">Đã tạo 3 repository khác</h3>
                        <GitCommit className="w-4 h-4 text-muted-foreground" />
                    </div>
                     <ul className="space-y-2 text-sm">
                        <li className="flex justify-between items-center">
                           <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                <Link href="#" className="text-primary hover:underline">khoavo261/deutsch-vn2</Link>
                           </div>
                           <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="w-3 h-3 rounded-full bg-blue-400" />
                                <span>TypeScript</span>
                                <span>20 tháng 8</span>
                           </div>
                        </li>
                        <li className="flex justify-between items-center">
                           <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                <Link href="#" className="text-primary hover:underline">khoavo261/Bisflow</Link>
                           </div>
                           <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="w-3 h-3 rounded-full bg-blue-400" />
                                <span>TypeScript</span>
                                <span>13 tháng 8</span>
                           </div>
                        </li>
                        <li className="flex justify-between items-center">
                           <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                <Link href="#" className="text-primary hover:underline">khoavo261/DeutscheEcke</Link>
                           </div>
                           <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="w-3 h-3 rounded-full bg-blue-400" />
                                <span>TypeScript</span>
                                <span>12 tháng 8</span>
                           </div>
                        </li>
                    </ul>
                </TimelineItem>

            </div>
        </div>
      </div>
    </div>
  );
}
