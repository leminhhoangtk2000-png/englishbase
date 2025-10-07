
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
import { ExerciseStatsDisplay } from "@/components/exercises/ExerciseStatsDisplay";
import { ExerciseCompletionBadge } from "@/components/exercises/ExerciseCompletionBadge";
import { ExerciseLikes } from "@/components/exercises/ExerciseLikes";
import { useCachedExerciseStats } from "@/hooks/useCachedExerciseStats";
import { CacheDebugPanel } from "@/components/cache-debug-panel";

// 🔧 Helper function to slugify exercise ID (same logic as API)
function slugifyExerciseId(id: string): string {
  return id
    .toLowerCase()
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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
  difficulty?: string;
}

interface ExerciseLevelPageProps {
  level: string;
}

const mockExercises = [
  {
    title: "Eine Wohnung in Leipzig finden",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat listening music",
    duration: "2 phút đọc",
    description: "Bài tập nghe về tìm nhà ở Leipzig, trình độ B1",
    href: "#",
    views: 1200,
    completed: true,
    rating: 4.8,
    tags: ["Nghe"],
    difficulty: "Cơ bản",
    level: "b1",
    slug: "eine-wohnung-in-leipzig-finden"
  },
  {
    title: "Kleine Gewohnheiten, große Wirkung",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat coffee guitar",
    duration: "3 phút đọc",
    description: "Bài tập nghe về thói quen hàng ngày và ý nghĩa lâu dài, trình độ B1",
    href: "#",
    views: 2300,
    completed: false,
    rating: 4.5,
    tags: ["Nghe"],
    difficulty: "Nâng cao",
    level: "b1",
    slug: "kleine-gewohnheiten-grosse-wirkung"
  },
  {
    title: "Mein Nebenjob im Studium",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat studying desk",
    duration: "3 phút đọc",
    description: "Bài tập nghe về kinh nghiệm đi làm thêm khi đang học đại học, trình độ B1",
    href: "#",
    views: 980,
    completed: true,
    rating: 4.9,
    tags: ["Đọc"],
    difficulty: "Cơ bản",
    level: "b1",
    slug: "mein-nebenjob-im-studium"
  },
  {
    title: "Freundschaft im digitalen Zeitalter",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat digital age",
    duration: "3 phút đọc",
    description: "Bài tập nghe về tình bạn trong thời đại số, trình độ B1",
    href: "#",
    views: 1500,
    completed: false,
    rating: 4.6,
    tags: ["Đọc"],
    difficulty: "Nâng cao",
    level: "b1",
    slug: "freundschaft-im-digitalen-zeitalter"
  },
  {
    title: "Homeoffice – Erfahrung und Meinung",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat home office",
    duration: "3 phút đọc",
    description: "Bài tập nghe về kinh nghiệm làm việc tại nhà, trình độ B1+",
    href: "#",
    views: 1800,
    completed: false,
    rating: 4.7,
    tags: ["Nghe"],
    difficulty: "Nâng cao",
    level: "b1",
    slug: "homeoffice-erfahrung-und-meinung"
  },
  {
    title: "Reisen als Student – mit wenig Geld die Welt entdecken",
    image: "https://placehold.co/600x400.png",
    data_ai_hint: "cat travel student",
    duration: "3 phút đọc",
    description: "Bài tập nghe về kinh nghiệm du lịch tiết kiệm thời sinh viên, trình độ B1+",
    href: "#",
    views: 2100,
    completed: false,
    rating: 4.8,
    tags: ["Nghe"],
    difficulty: "Cơ bản",
    level: "b1",
    slug: "reisen-als-student"
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

  // � Extract exercise IDs for batch fetch
  const exerciseIds = exercises.map(ex => ex.href.replace('/exercises/', ''));
  
  // 🚀 UPGRADED: Sử dụng intelligent cache system mới với incremental updates
  const { 
    stats: batchStats, 
    loading: statsLoading, 
    checkForUpdates: refreshStats, 
    clearCache: clearStatsCache,
    cacheInfo 
  } = useCachedExerciseStats(exerciseIds);

  // 🎯 Auto-track completion when user clicks on card
  const handleExerciseClick = async (exerciseId: string) => {
    try {
      // Auto-mark as completed when user clicks to view exercise
      await fetch('/api/exercise-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId,
          timeSpent: 0
        }),
      });
      console.log('✅ Auto-completed:', exerciseId);
    } catch (error) {
      console.error('❌ Error auto-completing exercise:', error);
    }
  };

  useEffect(() => {
    // Fetch exercises for the current level
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/exercises/${level}`);
        if (response.ok) {
          const data = await response.json();
          setExercises(data);
        } else {
          // Fallback to mock data if API fails
          setExercises(mockExercises as Exercise[]);
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setExercises(mockExercises as Exercise[]);
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
    // Filter by skill
    if (skillFilter !== "Tất cả" && !exercise.tags?.includes(skillFilter)) {
      return false;
    }
    // Filter by difficulty
    if (difficultyFilter !== "Tất cả" && exercise.difficulty !== difficultyFilter) {
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
      
      {/* 🔧 Cache Debug Panel (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <CacheDebugPanel className="mb-6" />
      )}
      
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <Card 
                key={exercise.title}
                className="h-full flex flex-col group transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                onClick={() => {
                  const exerciseId = exercise.href.replace('/exercises/', '');
                  handleExerciseClick(exerciseId);
                  router.push(exercise.href);
                }}
              >
                 <div className="p-2">
                    <div className="relative h-56 rounded-md overflow-hidden">
                      <Image
                        src={
                          exercise.image 
                            ? (exercise.image.startsWith('http') 
                                ? exercise.image 
                                : exercise.image.startsWith('/') 
                                  ? exercise.image 
                                  : `/${exercise.image}`)
                            : "https://placehold.co/600x400.png"
                        }
                        alt={exercise.title}
                        width={600}
                        height={400}
                        data-ai-hint={exercise.data_ai_hint || exercise.title}
                        className="object-cover w-full h-full"
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
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold font-headline flex-1">{exercise.title}</h4>
                    <ExerciseCompletionBadge 
                      exerciseId={exercise.href.replace('/exercises/', '')}
                      variant="icon"
                      className="flex-shrink-0"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground flex-grow">{exercise.description}</p>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0 text-xs text-muted-foreground flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1.5" />
                            <span>{exercise.duration}</span>
                        </div>
                        <ExerciseLikes 
                          exerciseId={exercise.href.replace('/exercises/', '')} 
                          variant="inline" 
                        />
                    </div>
                    <ExerciseStatsDisplay 
                      exerciseId={exercise.href.replace('/exercises/', '')} 
                      preloadedStats={batchStats[exercise.href.replace('/exercises/', '')]}
                    />
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Không tìm thấy bài tập phù hợp với bộ lọc.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
