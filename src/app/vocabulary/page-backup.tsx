"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BookOpenText, Volume2, History, Bookmark, BookOpen, ChevronDown, ChevronRight, GraduationCap, Target, Award, Trophy } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { translateWord } from "@/ai/flows/vocabulary-flow";
import { useToast } from "@/hooks/use-toast";
import SpeechButton from "@/components/speech-button";
import { VocabularyCard as VocabCard } from "@/components/vocabulary-card";
import { VocabularyHistoryCard } from "@/components/vocabulary-history-card";
import { SavedVocabularyCard } from "@/components/saved-vocabulary-card";
import { useVocabulary, VocabularyEntry } from "@/hooks/use-vocabulary";

interface VocabularyLevel {
    id: string;
    name: string;
    displayName: string;
    description?: string | null;
    topics?: VocabularyTopic[];
    _count?: {
        vocabularyEntries: number;
        topics: number;
    };
}

interface VocabularyTopic {
    id: string;
    name: string;
    displayName: string;
    description?: string | null;
    slug: string;
    order: number;
    isActive: boolean;
    levelId: string;
    _count: {
        vocabularyEntries: number;
    };
    vocabularyEntries?: VocabularyEntry[];
}


const searchHistorySample: VocabularyEntry[] = [];
const savedWordsSample: VocabularyEntry[] = [];

function VocabularyCard({ entry }: { entry: VocabularyEntry }) {
    return (
        <Card className="border-l-4 border-l-teal-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-gray-900">{entry.german}</h3>
                        <SpeechButton 
                            text={entry.german}
                            size="md"
                            variant="outline"
                        />
                        <Badge variant="outline" className="border-teal-200 text-teal-700">
                            {entry.type}
                        </Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-teal-100">
                            <Bookmark className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-medium text-gray-900">{entry.vietnamese}</span>
                        {entry.phonetic && (
                            <span className="text-sm text-gray-500 font-mono">
                                [{entry.phonetic}]
                            </span>
                        )}
                        {entry.plural && (
                            <span className="text-sm text-gray-500">
                                Số nhiều: <span className="font-medium">{entry.plural}</span>
                            </span>
                        )}
                    </div>

                    {entry.exampleGerman && (
                        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Ví dụ:</p>
                                <p className="italic text-gray-800">{entry.exampleGerman}</p>
                            </div>
                            {entry.exampleVietnamese && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Dịch nghĩa:</p>
                                    <p className="text-gray-700">{entry.exampleVietnamese}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                                {entry.level.displayName}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                {entry.topic.displayName}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <span>Độ khó: {entry.difficulty}/5</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function VocabularyPage() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [results, setResults] = React.useState<VocabularyEntry[] | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [notFound, setNotFound] = React.useState(false);
    const [vocabularyLevels, setVocabularyLevels] = React.useState<VocabularyLevel[]>([]);
    const [loadingLibrary, setLoadingLibrary] = React.useState(true);
    const [topicVocabulary, setTopicVocabulary] = React.useState<Record<string, VocabularyEntry[]>>({});
    const [loadingTopics, setLoadingTopics] = React.useState<Set<string>>(new Set());
    const { toast } = useToast();
    const { addToHistory } = useVocabulary();

    // Load vocabulary levels on component mount
    React.useEffect(() => {
        loadVocabularyLevels();
    }, []);

    const loadVocabularyLevels = async () => {
        try {
            const response = await fetch('/api/vocabulary/levels');
            if (response.ok) {
                const data = await response.json();
                setVocabularyLevels(data.data);
            }
        } catch (error) {
            console.error('Error loading vocabulary levels:', error);
        } finally {
            setLoadingLibrary(false);
        }
    };

    const performSearch = async (term: string) => {
        if (!term.trim()) {
            setResults(null);
            setNotFound(false);
            return;
        }

        setIsLoading(true);
        setNotFound(false);
        setResults(null);
        setSearchTerm(term);

        // Step 1: Search in database first
        try {
            const response = await fetch(`/api/vocabulary?search=${encodeURIComponent(term)}&limit=50`);
            if (response.ok) {
                const data = await response.json();
                if (data.data && data.data.length > 0) {
                    setResults(data.data);
                    // Add found words to history
                    data.data.forEach((word: VocabularyEntry) => {
                        addToHistory(word);
                    });
                    setIsLoading(false);
                    return;
                }
            }
        } catch (error) {
            console.error('Database search error:', error);
        }

        // Step 2: If not found, call Genkit AI flow
        try {
            const aiResult = await translateWord({ word: term });
            if (aiResult) {
                // Convert AI result to match our interface
                const convertedResult: VocabularyEntry = {
                    id: 'ai-generated',
                    german: aiResult.german,
                    vietnamese: aiResult.vietnamese,
                    phonetic: aiResult.phonetic,
                    plural: aiResult.plural,
                    type: aiResult.type,
                    exampleGerman: aiResult.exampleGerman,
                    exampleVietnamese: aiResult.exampleVietnamese,
                    difficulty: 1,
                    frequency: 0,
                    tags: [],
                    level: {
                        id: 'ai-level',
                        name: aiResult.level || 'AI',
                        displayName: 'AI Generated'
                    },
                    topic: {
                        id: 'ai-topic',
                        name: 'AI',
                        displayName: 'AI Generated',
                        slug: 'ai'
                    }
                };
                setResults([convertedResult]);
                // Add AI generated word to history
                addToHistory(convertedResult);
            } else {
                setNotFound(true);
            }
        } catch (error) {
            console.error("AI translation error:", error);
            setNotFound(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const term = searchTerm.trim();
        const wordCount = term.split(/\s+/).filter(Boolean).length;

        if (wordCount > 3) {
            toast({
                title: "Lỗi tìm kiếm",
                description: "Chức năng này chỉ hỗ trợ tra cứu tối đa 3 từ.",
                variant: "destructive",
            });
            return;
        }

        if (wordCount > 0) {
            performSearch(term);
        }
    };

    const handleHistoryClick = (word: string) => {
        performSearch(word);
    };

    const loadTopicVocabulary = async (levelName: string, topicSlug: string) => {
        try {
            const response = await fetch(`/api/vocabulary/${levelName}/${topicSlug}?limit=100`);
            if (response.ok) {
                const data = await response.json();
                return data.data || [];
            }
        } catch (error) {
            console.error(`Error loading vocabulary for ${levelName}/${topicSlug}:`, error);
        }
        return [];
    };

    const handleTopicClick = async (levelName: string, topicSlug: string, topicId: string) => {
        const topicKey = `${levelName}-${topicSlug}`;
        
        // If vocabulary not loaded yet, load it
        if (!topicVocabulary[topicKey]) {
            const newLoading = new Set(loadingTopics);
            newLoading.add(topicKey);
            setLoadingTopics(newLoading);

            try {
                const vocabulary = await loadTopicVocabulary(levelName, topicSlug);
                setTopicVocabulary(prev => ({
                    ...prev,
                    [topicKey]: vocabulary
                }));
            } finally {
                const newLoading = new Set(loadingTopics);
                newLoading.delete(topicKey);
                setLoadingTopics(newLoading);
            }
        }
    };

    const handleWordClick = (word: VocabularyEntry) => {
        setResults([word]);
        setSearchTerm(word.german);
        // Scroll to results section
        const resultsSection = document.getElementById('search-results');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Helper function to get level icon
    const getLevelIcon = (levelName: string) => {
        switch (levelName.toUpperCase()) {
            case 'A1':
                return <GraduationCap className="h-5 w-5" />;
            case 'A2':
                return <Target className="h-5 w-5" />;
            case 'B1':
                return <Award className="h-5 w-5" />;
            case 'B2':
                return <Trophy className="h-5 w-5" />;
            default:
                return <BookOpen className="h-5 w-5" />;
        }
    };


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-8">
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
                        {/* Grid layout với 3 cột: history, main content, saved */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left sidebar - Search History */}
                            <div className="lg:col-span-3">
                                <VocabularyHistoryCard />
                            </div>

                            {/* Main content - Vocabulary Library */}
                            <div className="lg:col-span-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BookOpenText className="w-5 h-5" />
                                            <span>Thư viện từ vựng</span>
                                        </CardTitle>
                                        <CardDescription>
                                            Khám phá từ vựng theo cấp độ và chủ đề
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {loadingLibrary ? (
                                            <div className="text-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                                <p className="mt-2 text-sm text-gray-600">Đang tải thư viện từ vựng...</p>
                                            </div>
                                        ) : (
                                            <Accordion type="multiple" className="w-full">
                                                {vocabularyLevels.map((level) => (
                                                    <AccordionItem key={level.id} value={level.name}>
                                                        <AccordionTrigger className="hover:no-underline">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="text-blue-600">
                                                                    {getLevelIcon(level.name)}
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="font-semibold text-lg">{level.displayName}</div>
                                                                    {level.description && (
                                                                        <div className="text-sm text-gray-600 font-normal">
                                                                            {level.description}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="pt-4">
                                                            {level.topics && level.topics.length > 0 ? (
                                                                <Accordion type="multiple" className="w-full pl-4">
                                                                    {level.topics.map((topic) => (
                                                                        <AccordionItem key={topic.id} value={topic.slug}>
                                                                            <AccordionTrigger 
                                                                                className="hover:no-underline py-3"
                                                                                onClick={() => loadTopicVocabulary(level.name, topic.slug)}
                                                                            >
                                                                                <div className="flex items-center justify-between w-full">
                                                                                    <span className="font-medium text-base text-left">
                                                                                        {topic.displayName}
                                                                                    </span>
                                                                                    {loadingTopics.has(`${level.name}-${topic.slug}`) && (
                                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                                                                                    )}
                                                                                </div>
                                                                            </AccordionTrigger>
                                                                            <AccordionContent className="pt-2">
                                                                                {topicVocabulary[`${level.name}-${topic.slug}`] ? (
                                                                                    <div className="grid gap-4">
                                                                                        {topicVocabulary[`${level.name}-${topic.slug}`].map((entry, index) => (
                                                                                            <VocabularyCard key={index} entry={entry} />
                                                                                        ))}
                                                                                    </div>
                                                                                ) : (
                                                                                    <p className="text-sm text-gray-500 italic">
                                                                                        Nhấn để tải từ vựng cho chủ đề này
                                                                                    </p>
                                                                                )}
                                                                            </AccordionContent>
                                                                        </AccordionItem>
                                                                    ))}
                                                                </Accordion>
                                                            ) : (
                                                                <p className="text-sm text-gray-500 italic pl-4">
                                                                    Chưa có chủ đề nào cho cấp độ này
                                                                </p>
                                                            )}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right sidebar - Saved Vocabulary */}
                            <div className="lg:col-span-3">
                                <SavedVocabularyCard />
                            </div>
                        </div>
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

                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold font-headline text-gray-900">
                                    Thư viện Từ vựng
                                </h2>
                                <p className="text-muted-foreground mt-2">Khám phá từ vựng theo chủ đề và trình độ từ cơ bản đến nâng cao.</p>
                            </div>
                            
                            {loadingLibrary ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mx-auto"></div>
                                    <p className="mt-4 text-gray-600 font-medium">Đang tải thư viện từ vựng...</p>
                                </div>
                            ) : vocabularyLevels.length === 0 ? (
                                <div className="text-center py-12">
                                    <BookOpenText className="mx-auto h-16 w-16 text-gray-400" />
                                    <p className="mt-4 text-gray-600">Không có dữ liệu từ vựng</p>
                                </div>
                            ) : (
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {vocabularyLevels.map((level) => (
                                        <AccordionItem 
                                            value={level.id} 
                                            key={level.id}
                                            className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden bg-white"
                                        >
                                            <AccordionTrigger className="text-lg font-semibold hover:no-underline px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                                                <div className="flex items-center gap-4 w-full">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-teal-500 text-white rounded-lg shadow-sm">
                                                            {getLevelIcon(level.name)}
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="font-bold text-gray-900">{level.displayName}</div>
                                                            <div className="text-sm text-gray-500 font-normal">
                                                                {level.description || `Từ vựng trình độ ${level.displayName}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 ml-auto">
                                                        <Badge variant="secondary" className="bg-teal-100 text-teal-700 border-teal-200">
                                                            {level._count?.topics || 0} chủ đề
                                                        </Badge>
                                                        <Badge variant="outline" className="border-gray-300 text-gray-700">
                                                            {level._count?.vocabularyEntries || 0} từ
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-6 pb-4">
                                                <Accordion type="multiple" className="w-full">
                                                    {level.topics?.map((topic) => {
                                                        const topicKey = `${level.name}-${topic.slug}`;
                                                        const vocabulary = topicVocabulary[topicKey] || [];
                                                        const isLoading = loadingTopics.has(topicKey);
                                                        
                                                        return (
                                                            <AccordionItem value={topic.id} key={topic.id} className="border-none">
                                                                <AccordionTrigger 
                                                                    className="text-base font-medium hover:no-underline py-3 hover:bg-gray-50 rounded-lg px-3 transition-colors duration-150"
                                                                    onClick={() => handleTopicClick(level.name, topic.slug, topic.id)}
                                                                >
                                                                    <div className="flex items-center justify-between w-full pr-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="p-1.5 bg-teal-400 text-white rounded-md">
                                                                                <BookOpen className="h-4 w-4" />
                                                                            </div>
                                                                            <div className="text-left">
                                                                                <div className="font-medium text-gray-900">{topic.displayName}</div>
                                                                                <div className="text-sm text-gray-500 font-normal">
                                                                                    {topic.description || `Từ vựng về ${topic.displayName.toLowerCase()}`}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <Badge variant="outline" className="border-teal-200 text-teal-700 bg-teal-50">
                                                                            {topic._count?.vocabularyEntries || 0} từ
                                                                        </Badge>
                                                                    </div>
                                                                </AccordionTrigger>
                                                                <AccordionContent className="px-3 pt-2">
                                                                    {isLoading ? (
                                                                        <div className="flex items-center justify-center py-6">
                                                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent"></div>
                                                                            <span className="ml-3 text-gray-600">Đang tải từ vựng...</span>
                                                                        </div>
                                                                    ) : vocabulary.length > 0 ? (
                                                                        <div className="grid gap-3 pt-2">
                                                                            {vocabulary.map((word) => (
                                                                                <Card 
                                                                                    key={word.id}
                                                                                    className="cursor-pointer hover:bg-teal-50 border border-gray-200 hover:border-teal-300 transition-all duration-150"
                                                                                    onClick={() => handleWordClick(word)}
                                                                                >
                                                                                    <CardContent className="p-4">
                                                                                        <div className="flex items-center justify-between">
                                                                                            <div className="flex-1">
                                                                                                <div className="flex items-center space-x-3">
                                                                                                    <span className="font-semibold text-gray-900 text-lg">{word.german}</span>
                                                                                                    <SpeechButton 
                                                                                                        text={word.german}
                                                                                                        size="sm"
                                                                                                        variant="ghost"
                                                                                                    />
                                                                                                    <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                                                                                                        {word.type}
                                                                                                    </Badge>
                                                                                                    {word.plural && (
                                                                                                        <span className="text-sm text-gray-500">({word.plural})</span>
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="text-gray-700 mt-1 font-medium">
                                                                                                    {word.vietnamese}
                                                                                                </div>
                                                                                                {word.phonetic && (
                                                                                                    <div className="text-sm text-gray-500 italic mt-1">
                                                                                                        [{word.phonetic}]
                                                                                                    </div>
                                                                                                )}
                                                                                                {word.exampleGerman && (
                                                                                                    <div className="mt-2 text-sm">
                                                                                                        <div className="text-gray-600 italic">"{word.exampleGerman}"</div>
                                                                                                        {word.exampleVietnamese && (
                                                                                                            <div className="text-gray-500">"{word.exampleVietnamese}"</div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                                                                        </div>
                                                                                    </CardContent>
                                                                                </Card>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                                                                            <BookOpenText className="mx-auto h-8 w-8 mb-2 opacity-50" />
                                                                            <p className="text-sm">Chưa có từ vựng trong chủ đề này</p>
                                                                        </div>
                                                                    )}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        );
                                                    }) || (
                                                        <div className="text-center py-8 text-gray-500">
                                                            <BookOpenText className="mx-auto h-8 w-8 mb-2 opacity-50" />
                                                            <p className="text-sm">Chưa có chủ đề nào</p>
                                                        </div>
                                                    )}
                                                </Accordion>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            )}
                        </div>
                    </>
                )}

                {!isLoading && results && (
                    <div id="search-results" className="space-y-6 mb-8">
                        <div className="border-2 border-dashed border-purple-200 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
                            <h3 className="text-xl font-bold mb-4 text-purple-800">
                                {searchTerm ? `Kết quả tìm kiếm: "${searchTerm}"` : 'Kết quả tìm kiếm'}
                            </h3>
                            <div className="space-y-4">
                                {results.map((entry, index) => (
                                    <VocabularyCard key={index} entry={entry} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
