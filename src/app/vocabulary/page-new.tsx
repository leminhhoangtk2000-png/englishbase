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

function VocabularyCard({ entry }: { entry: VocabularyEntry }) {
    return (
        <Card className="w-full">
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-2xl font-bold text-gray-900">{entry.german}</h3>
                                <SpeechButton text={entry.german} size="sm" />
                            </div>
                            <Badge variant="outline" className="text-xs">
                                {entry.type}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-2">
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
                                <div className="flex items-center justify-between">
                                    <p className="italic text-gray-800">{entry.exampleGerman}</p>
                                    <SpeechButton text={entry.exampleGerman} size="sm" />
                                </div>
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
            toast({
                title: "Lỗi dịch",
                description: "Không thể dịch từ này. Vui lòng thử lại sau.",
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-8">
                <h1 className="text-4xl font-bold font-headline text-gray-900 mb-4">
                    Từ vựng tiếng Đức
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Tìm kiếm và học từ vựng tiếng Đức một cách hiệu quả với hệ thống AI
                </p>

                {/* Search Form */}
                <form 
                    className="flex gap-2 mb-8"
                    onSubmit={handleSearchSubmit}
                >
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

            {/* Not Found */}
            {notFound && (
                <div className="text-center py-12">
                    <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                        <Search className="h-full w-full" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">Không tìm thấy kết quả</h3>
                    <p className="mt-1 text-muted-foreground">
                        Chúng tôi không tìm thấy từ nào phù hợp với "{searchTerm}". Vui lòng thử lại.
                    </p>
                </div>
            )}

            {/* Main Layout - Library */}
            {!isLoading && !results && !notFound && (
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
            )}
        </div>
    );
}
