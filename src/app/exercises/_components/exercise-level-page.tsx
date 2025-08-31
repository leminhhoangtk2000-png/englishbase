
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, SlidersHorizontal, Eye, MessageCircle, CheckCircle2, Star, BookOpen, Tag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Exercise {
  title: string;
  description: string;
  href: string;
  level: string;
  tags: string[];
  slug: string;
  image?: string;
  data_ai_hint?: string;
  completed?: boolean;
  duration?: string;
  rating?: number;
  views?: number;
  comments?: number;
}

interface ExerciseLevelPageProps {
  level: string;
}

const exercises = [
  {
    title: "Eine Wohnung in Leipzig finden",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat listening music",
    duration: "2 phút đọc",
    description: "Bài tập nghe về tìm nhà ở Leipzig, trình độ B1",
    href: "#",
    views: 1200,
    comments: 15,
    completed: true,
    rating: 4.8,
  },
  {
    title: "Kleine Gewohnheiten, große Wirkung",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat coffee guitar",
    duration: "3 phút đọc",
    description: "Bài tập nghe về thói quen hàng ngày và ý nghĩa lâu dài, trình độ B1",
    href: "#",
    views: 2300,
    comments: 28,
    completed: false,
    rating: 4.5,
  },
  {
    title: "Mein Nebenjob im Studium",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat studying desk",
    duration: "3 phút đọc",
    description: "Bài tập nghe về kinh nghiệm đi làm thêm khi đang học đại học, trình độ B1",
    href: "#",
    views: 980,
    comments: 12,
    completed: true,
    rating: 4.9,
  },
  {
    title: "Freundschaft im digitalen Zeitalter",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat digital age",
    duration: "3 phút đọc",
    description: "Bài tập nghe về tình bạn trong thời đại số, trình độ B1",
    href: "#",
    views: 1500,
    comments: 22,
    completed: false,
    rating: 4.6,
  },
  {
    title: "Homeoffice – Erfahrung und Meinung",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat home office",
    duration: "3 phút đọc",
    description: "Bài tập nghe về kinh nghiệm làm việc tại nhà, trình độ B1+",
    href: "#",
    views: 1800,
    comments: 19,
    completed: false,
    rating: 4.7,
  },
  {
    title: "Reisen als Student – mit wenig Geld die Welt entdecken",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat travel student",
    duration: "3 phút đọc",
    description: "Bài tập nghe về kinh nghiệm du lịch tiết kiệm thời sinh viên, trình độ B1+",
    href: "#",
    views: 2100,
    comments: 35,
    completed: false,
    rating: 4.8,
  },
];

const levels = [
  { value: "a1", label: "A1 Niveau" },
  { value: "a2", label: "A2 Niveau" },
  { value: "b1", label: "B1 Niveau" },
  { value: "b2", label: "B2 Niveau" },
];

export function ExerciseLevelPage({ level = "b1" }: { level: string }) {
  const router = useRouter();
  const [skillFilter, setSkillFilter] = React.useState("Tất cả");
  const [difficultyFilter, setDifficultyFilter] = React.useState("Tất cả");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch exercises for the current level
    const fetchExercises = async () => {
      try {
        const response = await fetch(`/api/exercises/${level}`);
        if (response.ok) {
          const data = await response.json();
          setExercises(data);
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [level]);

  const handleLevelChange = (newLevel: string) => {
    router.push(`/exercises/${newLevel}`);
  };

  const filteredExercises = exercises.filter(exercise => {
    if (skillFilter !== "Tất cả" && !exercise.tags.includes(skillFilter)) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải bài tập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-headline">Bài tập nghe trình độ {level.toUpperCase()}</h1>
        <p className="text-muted-foreground mt-2">Luyện tập kỹ năng nghe qua các bài hội thoại và tình huống thực tế.</p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm font-semibold">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Bộ lọc</span>
              </div>
              <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-muted-foreground">KỸ NĂNG</span>
                  <div className="flex gap-2">
                    <Button
                      variant={skillFilter === "Tất cả" ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setSkillFilter("Tất cả")}
                    >
                      Tất cả
                    </Button>
                    <Button
                      variant={skillFilter === "Nghe" ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setSkillFilter("Nghe")}
                    >
                      Nghe
                    </Button>
                    <Button
                      variant={skillFilter === "Đọc" ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setSkillFilter("Đọc")}
                    >
                      Đọc
                    </Button>
                  </div>
              </div>
               <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-muted-foreground">CẤP ĐỘ</span>
                  <div className="flex gap-2">
                    <Button
                      variant={difficultyFilter === "Tất cả" ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setDifficultyFilter("Tất cả")}
                    >
                      Tất cả
                    </Button>
                    <Button
                      variant={difficultyFilter === "Nâng cao" ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setDifficultyFilter("Nâng cao")}
                    >
                      Nâng cao
                    </Button>
                    <Button
                      variant={difficultyFilter === "Cơ bản" ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setDifficultyFilter("Cơ bản")}
                    >
                      Cơ bản
                    </Button>
                  </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               <Select value={level} onValueChange={handleLevelChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chọn trình độ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(lvl => (
                        <SelectItem key={lvl.value} value={lvl.value}>
                            {lvl.label}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>
      
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <Link href={exercise.href} key={exercise.title}>
              <Card className="h-full flex flex-col group transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                 <div className="p-2">
                    <div className="relative">
                      <Image
                        src={exercise.image || "https://placehold.co/600x400.png"}
                        alt={exercise.title}
                        width={600}
                        height={400}
                        data-ai-hint={exercise.data_ai_hint || exercise.title}
                        className="object-cover w-full h-40 rounded-md"
                      />
                      {exercise.completed && (
                         <Badge className="absolute top-2 right-2 bg-green-600/90 text-white border-green-600">
                            <CheckCircle2 className="w-3 h-3 mr-1.5" />
                            Đã hoàn thành
                        </Badge>
                      )}
                    </div>
                </div>
                <CardContent className="px-4 pb-4 pt-2 flex flex-col flex-grow">
                  <h4 className="font-semibold mb-2 font-headline">{exercise.title}</h4>
                  <p className="text-sm text-muted-foreground flex-grow">{exercise.description}</p>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0 text-xs text-muted-foreground flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1.5" />
                            <span>{exercise.duration}</span>
                        </div>
                         <div className="flex items-center">
                            <Star className="w-3 h-3 mr-1.5 text-yellow-400 fill-yellow-400" />
                            <span>{exercise.rating}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1.5" />
                            <span>{((exercise.views || 0) / 1000).toFixed(1)}k</span>
                        </div>
                        <div className="flex items-center">
                            <MessageCircle className="w-3 h-3 mr-1.5" />
                            <span>{exercise.comments}</span>
                        </div>
                    </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
