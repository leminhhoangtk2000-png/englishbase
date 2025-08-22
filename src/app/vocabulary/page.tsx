"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BookOpenText } from "lucide-react";
import React from "react";

export default function VocabularyPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [results, setResults] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    // Here you would typically call an API
    // For now, we'll just simulate a loading state
    setIsLoading(true);
    setTimeout(() => {
      //
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight">
          Tra cứu Từ vựng
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Nhập một từ tiếng Đức hoặc tiếng Việt để tìm định nghĩa, ví dụ và cách phát âm.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-8 flex w-full items-center space-x-2"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Nhập từ cần tra..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? "Đang tìm..." : "Tìm kiếm"}
          </Button>
        </form>
      </div>

      <div className="mt-16 max-w-4xl mx-auto">
        {isLoading ? (
            <div className="text-center text-muted-foreground">Đang tải kết quả...</div>
        ) : !results ? (
          <div className="text-center py-16 px-6 bg-secondary/50 rounded-lg">
            <BookOpenText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Bắt đầu tra cứu</h3>
            <p className="mt-1 text-muted-foreground">
              Kết quả của bạn sẽ được hiển thị ở đây.
            </p>
          </div>
        ) : (
          <div>{/* Render results here */}</div>
        )}
      </div>
    </div>
  );
}
