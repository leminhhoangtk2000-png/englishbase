"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BookOpenText, Volume2, History, Bookmark } from "lucide-react";
import React from "react";
import { vocabularyList, type VocabularyEntry } from "@/lib/vocabulary-data";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const searchHistorySample: VocabularyEntry[] = [
  vocabularyList[0], // der Kopf
  vocabularyList[4], // das Auge
  vocabularyList[7], // die Nase
];

const savedWordsSample: VocabularyEntry[] = [
  vocabularyList[11], // der Zahn
  vocabularyList[12], // die Zunge
  vocabularyList[14], // die Wange
];

const vocabularyByTopic = [
    {
        topic: "Körperteile (Các bộ phận cơ thể)",
        level: "A1",
        words: vocabularyList,
    }
    // Add more topics here in the future
]

export default function VocabularyPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [results, setResults] = React.useState<VocabularyEntry[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [notFound, setNotFound] = React.useState(false);

  const performSearch = (term: string) => {
    if (!term.trim()) {
      setResults(null);
      setNotFound(false);
      return;
    }

    setIsLoading(true);
    setNotFound(false);
    setResults(null);
    setSearchTerm(term);

    setTimeout(() => {
      const lowerCaseSearchTerm = term.toLowerCase().trim();
      const filteredResults = vocabularyList.filter(
        (entry) =>
          entry.german.toLowerCase().includes(lowerCaseSearchTerm) ||
          entry.vietnamese.toLowerCase().includes(lowerCaseSearchTerm) ||
          entry.plural.toLowerCase().includes(lowerCaseSearchTerm)
      );

      if (filteredResults.length > 0) {
        setResults(filteredResults);
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    }, 500); // Simulate network delay
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  const handleHistoryClick = (word: string) => {
    performSearch(word);
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
          onSubmit={handleSearchSubmit}
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
        {isLoading && (
            <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="ml-4 text-muted-foreground">Đang tải kết quả...</p>
            </div>
        )}
        
        {!isLoading && notFound && (
            <div className="text-center py-16 px-6 bg-secondary/50 rounded-lg">
                <BookOpenText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Không tìm thấy kết quả</h3>
                <p className="mt-1 text-muted-foreground">
                    Chúng tôi không tìm thấy từ nào phù hợp với "{searchTerm}". Vui lòng thử lại.
                </p>
            </div>
        )}

        {!isLoading && !results && !notFound && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="w-5 h-5" />
                            <span>Lịch sử tra cứu</span>
                        </CardTitle>
                        <CardDescription>Các từ bạn đã tra gần đây.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-1">
                            {searchHistorySample.map(item => (
                                <li key={item.german}>
                                   <button 
                                      onClick={() => handleHistoryClick(item.german)}
                                      className="flex justify-between items-center text-sm w-full text-left p-2 rounded-md hover:bg-muted"
                                    >
                                        <span className="font-medium">{item.german}</span>
                                        <span className="text-muted-foreground">{item.vietnamese}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bookmark className="w-5 h-5" />
                            <span>Từ vựng đã lưu</span>
                        </CardTitle>
                        <CardDescription>Các từ bạn đã lưu để học lại.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-1">
                             {savedWordsSample.map(item => (
                                <li key={item.german}>
                                    <button 
                                      onClick={() => handleHistoryClick(item.german)}
                                      className="flex justify-between items-center text-sm w-full text-left p-2 rounded-md hover:bg-muted"
                                    >
                                        <span className="font-medium">{item.german}</span>
                                        <span className="text-muted-foreground">{item.vietnamese}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            
            <Separator className="my-12" />

            <div className="space-y-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold font-headline">Thư viện Từ vựng</h2>
                    <p className="text-muted-foreground">Khám phá từ vựng theo chủ đề và trình độ.</p>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {vocabularyByTopic.map((topicItem, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="text-lg font-semibold">
                        <div className="flex items-center gap-4">
                            <Badge>{topicItem.level}</Badge>
                            <span>{topicItem.topic}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[35%]">Từ tiếng Đức</TableHead>
                              <TableHead className="w-[35%]">Số nhiều</TableHead>
                              <TableHead>Nghĩa tiếng Việt</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {topicItem.words.map((word) => (
                              <TableRow key={word.german}>
                                <TableCell className="font-medium">{word.german}</TableCell>
                                <TableCell>{word.plural}</TableCell>
                                <TableCell>{word.vietnamese}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
            </div>
          </>
        )}

        {!isLoading && results && (
          <div className="space-y-6">
            {results.map((entry, index) => (
                <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-bold font-headline text-primary">{entry.german}</h2>
                                <Badge variant="outline">{entry.vietnamese}</Badge>
                            </div>
                           <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon">
                                    <Bookmark className="h-5 w-5" />
                                    <span className="sr-only">Lưu từ</span>
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Volume2 className="h-5 w-5" />
                                    <span className="sr-only">Phát âm</span>
                                </Button>
                           </div>
                        </div>
                         <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                            <span>Số nhiều: <span className="font-semibold text-foreground">{entry.plural}</span></span>
                            <Separator orientation="vertical" className="h-4" />
                            <span>Phiên âm: <span className="font-semibold text-foreground">{entry.phonetic}</span></span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                       <div>
                            <p className="text-sm font-semibold text-muted-foreground">Ví dụ:</p>
                            <p className="italic">{entry.exampleGerman}</p>
                       </div>
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground">Giải nghĩa:</p>
                            <p>{entry.exampleVietnamese}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
