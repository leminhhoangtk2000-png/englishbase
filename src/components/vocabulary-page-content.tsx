"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BookOpenText, GraduationCap, Target, Award, Trophy, BookOpen } from "lucide-react";
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
}

interface VocabularyTopic {
    id: string;
    name: string;
    displayName: string;
    slug: string;
}

export function VocabularyPageContent() {
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

        // Step 2: If not found in database, try AI translation
        try {
            const translatedWord = await translateWord({ word: term });
            
            if (translatedWord) {
                // Convert AI response to VocabularyEntry format
                const aiWord: VocabularyEntry = {
                    id: `ai-${Date.now()}`,
                    german: translatedWord.german,
                    vietnamese: translatedWord.vietnamese,
                    phonetic: translatedWord.phonetic,
                    type: translatedWord.type,
                    level: {
                        id: 'ai-level',
                        name: translatedWord.level,
                        displayName: translatedWord.level
                    },
                    exampleGerman: translatedWord.exampleGerman,
                    exampleVietnamese: translatedWord.exampleVietnamese,
                    plural: translatedWord.plural,
                    difficulty: 3,
                    frequency: 0,
                    tags: [],
                    topic: {
                        id: 'ai-topic',
                        name: 'general',
                        displayName: 'Tổng quát',
                        slug: 'general'
                    }
                };
                
                const results = [aiWord];
                setResults(results);
                // Add AI results to history
                results.forEach((word) => {
                    addToHistory(word);
                });
            } else {
                setNotFound(true);
            }
        } catch (error) {
            console.error('AI translation error:', error);
            setNotFound(true);
            toast({
                title: "Lỗi tìm kiếm",
                description: "Không thể tìm kiếm từ vựng. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(searchTerm);
    };

    const loadTopicVocabulary = async (levelName: string, topicSlug: string) => {
        const key = `${levelName}-${topicSlug}`;
        
        if (topicVocabulary[key]) {
            return; // Already loaded
        }

        setLoadingTopics(prev => new Set(prev).add(key));

        try {
            const response = await fetch(`/api/vocabulary?level=${levelName}&topic=${topicSlug}&limit=100`);
            if (response.ok) {
                const data = await response.json();
                setTopicVocabulary(prev => ({
                    ...prev,
                    [key]: data.data || []
                }));
            }
        } catch (error) {
            console.error('Error loading topic vocabulary:', error);
        } finally {
            setLoadingTopics(prev => {
                const newSet = new Set(prev);
                newSet.delete(key);
                return newSet;
            });
        }
    };

    const handleHistoryClick = (term: string) => {
        setSearchTerm(term);
        performSearch(term);
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
        <div className="space-y-6">
            {/* Search Form */}
            <div className="max-w-2xl mx-auto">
                <form className="flex gap-2" onSubmit={handleSearchSubmit}>
                    <Input
                        type="text"
                        placeholder="Nhập từ tiếng Đức hoặc tiếng Việt..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <Search className="w-4 h-4" />
                        )}
                    </Button>
                </form>
            </div>

            {/* Search Results */}
            {!isLoading && results && (
                <div id="search-results">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="w-5 h-5" />
                                {searchTerm ? `Kết quả cho "${searchTerm}"` : 'Kết quả tìm kiếm'}
                            </CardTitle>
                            <CardDescription>
                                Tìm thấy {results.length} từ vựng
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {results.map((entry, index) => (
                                <VocabCard key={index} word={entry} />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Not Found */}
            {notFound && (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                    <p className="text-gray-600">
                        Chúng tôi không tìm thấy từ nào phù hợp với <strong>"{searchTerm}"</strong>.
                        <br />Hãy thử với từ khóa khác hoặc kiểm tra chính tả.
                    </p>
                </div>
            )}

            {/* Main Content */}
            {!isLoading && !results && !notFound && (
                <div className="space-y-6">
                    {/* History and Saved cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <VocabularyHistoryCard />
                        <SavedVocabularyCard />
                    </div>

                    {/* Vocabulary Library */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpenText className="w-5 h-5" />
                                    Thư viện từ vựng
                                </CardTitle>
                                <CardDescription>
                                    Khám phá từ vựng theo cấp độ và chủ đề
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loadingLibrary ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                        <span className="ml-2">Đang tải thư viện từ vựng...</span>
                                    </div>
                                ) : (
                                    <Accordion type="single" collapsible className="w-full">
                                        {vocabularyLevels.map((level) => (
                                            <AccordionItem key={level.id} value={level.name}>
                                                <AccordionTrigger className="text-left">
                                                    <div className="flex items-center gap-3">
                                                        {getLevelIcon(level.name)}
                                                        <div>
                                                            <div className="font-semibold">{level.displayName}</div>
                                                            {level.description && (
                                                                <div className="text-sm text-muted-foreground font-normal">
                                                                    {level.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-2">
                                                    {level.topics && level.topics.length > 0 ? (
                                                        <Accordion type="multiple" className="pl-4">
                                                            {level.topics.map((topic) => (
                                                                <AccordionItem key={topic.id} value={topic.slug}>
                                                                    <AccordionTrigger
                                                                        className="text-left py-3"
                                                                        onClick={() => loadTopicVocabulary(level.name, topic.slug)}
                                                                    >
                                                                        <div className="flex items-center justify-between w-full pr-4">
                                                                            <span className="font-medium">{topic.displayName}</span>
                                                                            {loadingTopics.has(`${level.name}-${topic.slug}`) && (
                                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                                                            )}
                                                                        </div>
                                                                    </AccordionTrigger>
                                                                    <AccordionContent className="pt-2">
                                                                        {topicVocabulary[`${level.name}-${topic.slug}`] ? (
                                                                            <div className="grid gap-4">
                                                                                {topicVocabulary[`${level.name}-${topic.slug}`].map((entry, index) => (
                                                                                    <VocabCard key={index} word={entry} />
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
                </div>
            )}
        </div>
    );
}
