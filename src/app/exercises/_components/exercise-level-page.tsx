
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

const exercises = [
  {
    title: "Eine Wohnung in Leipzig finden",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat listening music",
    duration: "2 phút đọc",
    description: "Bài tập nghe về tìm nhà ở Leipzig, trình độ B1",
    href: "#",
  },
  {
    title: "Kleine Gewohnheiten, große Wirkung",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat coffee guitar",
    duration: "3 phút đọc",
    description: "Bài tập nghe về thói quen hàng ngày và ý nghĩa lâu dài, trình độ B1",
    href: "#",
  },
  {
    title: "Mein Nebenjob im Studium",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat studying desk",
    duration: "3 phút đọc",
    description: "Bài tập nghe về kinh nghiệm đi làm thêm khi đang học đại học, trình độ B1",
    href: "#",
  },
  {
    title: "Freundschaft im digitalen Zeitalter",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat digital age",
    duration: "3 phút đọc",
    description: "Bài tập nghe về tình bạn trong thời đại số, trình độ B1",
    href: "#",
  },
  {
    title: "Homeoffice – Erfahrung und Meinung",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat home office",
    duration: "3 phút đọc",
    description: "Bài tập nghe về kinh nghiệm làm việc tại nhà, trình độ B1+",
    href: "#",
  },
  {
    title: "Reisen als Student – mit wenig Geld die Welt entdecken",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat travel student",
    duration: "3 phút đọc",
    description: "Bài tập nghe về kinh nghiệm du lịch tiết kiệm thời sinh viên, trình độ B1+",
    href: "#",
  },
];

export function ExerciseLevelPage() {
  const [skillFilter, setSkillFilter] = React.useState("Nghe");
  const [levelFilter, setLevelFilter] = React.useState("Nâng cao");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <Card>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">KỸ NĂNG</h3>
                <div className="flex gap-2">
                  <Button
                    variant={skillFilter === "Tất cả" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSkillFilter("Tất cả")}
                    className="flex-1"
                  >
                    Tất cả
                  </Button>
                  <Button
                    variant={skillFilter === "Nghe" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSkillFilter("Nghe")}
                    className="flex-1"
                  >
                    Nghe
                  </Button>
                  <Button
                    variant={skillFilter === "Đọc" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSkillFilter("Đọc")}
                    className="flex-1"
                  >
                    Đọc
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">CẤP ĐỘ</h3>
                 <div className="flex gap-2">
                  <Button
                    variant={levelFilter === "Tất cả" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setLevelFilter("Tất cả")}
                    className="flex-1"
                  >
                    Tất cả
                  </Button>
                  <Button
                    variant={levelFilter === "Nâng cao" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setLevelFilter("Nâng cao")}
                    className="flex-1"
                  >
                    Nâng cao
                  </Button>
                  <Button
                    variant={levelFilter === "Cơ bản" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setLevelFilter("Cơ bản")}
                     className="flex-1"
                  >
                    Cơ bản
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
        <main className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <Link href={exercise.href} key={exercise.title}>
                <Card className="overflow-hidden h-full flex flex-col group transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative">
                        <Image
                        src={exercise.image}
                        alt={exercise.title}
                        width={600}
                        height={400}
                        data-ai-hint={exercise.data_ai_hint}
                        className="object-cover w-full h-48"
                        />
                        <div className="absolute inset-0 bg-black/50 p-4 flex flex-col justify-end text-white">
                            <h3 className="font-bold text-lg font-headline leading-tight">{exercise.title}</h3>
                            <p className="text-xs mt-1">@deutsch.vn</p>
                        </div>
                    </div>
                    <CardContent className="p-4 flex flex-col flex-grow">
                        <h4 className="font-semibold mb-2">{exercise.title}</h4>
                        <div className="flex items-center text-xs text-muted-foreground mb-3">
                            <Clock className="w-3 h-3 mr-1.5" />
                            <span>{exercise.duration}</span>
                        </div>
                        <p className="text-sm text-muted-foreground flex-grow">{exercise.description}</p>
                    </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
