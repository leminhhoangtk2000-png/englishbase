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
import { useToast } from "@/hooks/use-toast";
import SpeechButton from "@/components/speech-button";
import { VocabularyCard as VocabCard } from "@/components/vocabulary-card";
import { VocabularyHistoryCard } from "@/components/vocabulary-history-card";
import { SavedVocabularyCard } from "@/components/saved-vocabulary-card";
import { useVocabulary, VocabularyEntry } from "@/hooks/use-vocabulary";
import { extractGender, isNoun, addGenderToNoun } from "@/lib/gender-utils";

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

interface VocabularySuggestion extends VocabularyEntry {
    similarity: number;
    matchType: 'german' | 'vietnamese';
}

export function VocabularyPageContent() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [results, setResults] = React.useState<VocabularyEntry[] | null>(null);
    const [suggestions, setSuggestions] = React.useState<VocabularySuggestion[] | null>(null);
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

    const loadSuggestions = async (term: string) => {
        try {
            const response = await fetch(`/api/vocabulary/suggestions?q=${encodeURIComponent(term)}&limit=5`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && data.data.length > 0) {
                    setSuggestions(data.data);
                    setNotFound(false);
                    toast({
                        title: "Không tìm thấy từ chính xác",
                        description: `Tìm thấy ${data.data.length} từ tương tự cho "${term}"`,
                        variant: "default",
                    });
                } else {
                    setNotFound(true);
                    setSuggestions(null);
                }
            } else {
                setNotFound(true);
                setSuggestions(null);
            }
        } catch (error) {
            console.error('Error loading suggestions:', error);
            setNotFound(true);
            setSuggestions(null);
        }
    };

    const performSearch = async (term: string) => {
        if (!term.trim()) {
            setResults(null);
            setSuggestions(null);
            setNotFound(false);
            return;
        }

        setIsLoading(true);
        setNotFound(false);
        setSuggestions(null);
        // Don't clear results immediately to avoid flash of empty state
        // setResults(null);
        setSearchTerm(term);

        try {
            // First try database search
            const response = await fetch(`/api/vocabulary?search=${encodeURIComponent(term)}&limit=50`);
            if (response.ok) {
                const data = await response.json();
                if (data.data && data.data.length > 0) {
                    // Process database results to add gender information
                    const enhancedResults = data.data.map((word: VocabularyEntry) => {
                        const gender = extractGender(word.german);
                        return {
                            ...word,
                            gender: gender
                        };
                    });
                    
                    setResults(enhancedResults);
                    // Add found words to history
                    enhancedResults.forEach((word: VocabularyEntry) => {
                        addToHistory(word);
                    });
                    setIsLoading(false);
                    return;
                }
            }

            // If not found in database, try AI search and auto-save
            const aiResponse = await fetch('/api/vocabulary/ai-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word: term })
            });

            if (aiResponse.ok) {
                const aiData = await aiResponse.json();
                if (aiData.success && aiData.data) {
                    // Extract gender for nouns and enhance German word
                    let germanWord = aiData.data.definitions.german;
                    let gender = extractGender(germanWord);
                    
                    // If it's a noun and doesn't have gender, try to add it
                    if (isNoun(aiData.data.partOfSpeech) && !gender) {
                        germanWord = addGenderToNoun(germanWord);
                        gender = extractGender(germanWord);
                        
                        // Show helpful toast about gender addition
                        if (gender) {
                            toast({
                                title: "🔍 Giống từ được thêm tự động",
                                description: `Đã thêm "${gender}" cho danh từ "${germanWord.replace(/^(der|die|das)\s+/, '')}"`,
                                variant: "default",
                            });
                        }
                    }

                    // Transform AI data to VocabularyEntry format
                    const transformedEntry: VocabularyEntry = {
                        id: aiData.data.id,
                        german: germanWord,
                        vietnamese: aiData.data.definitions.vietnamese,
                        phonetic: aiData.data.pronunciation,
                        plural: aiData.data.plural,
                        type: aiData.data.partOfSpeech,
                        gender: gender,
                        exampleGerman: aiData.data.examples?.[0]?.german,
                        exampleVietnamese: aiData.data.examples?.[0]?.vietnamese,
                        difficulty: aiData.data.difficulty || 3,
                        frequency: aiData.data.frequency || 1,
                        tags: aiData.data.tags || [],
                        level: {
                            id: `level-${aiData.data.level.toLowerCase()}`,
                            name: aiData.data.level,
                            displayName: `Grundstufe ${aiData.data.level}`
                        },
                        topic: {
                            id: 'topic-general',
                            name: 'allgemein',
                            displayName: 'Tổng quát',
                            slug: 'allgemein'
                        }
                    };

                    setResults([transformedEntry]);
                    console.log('Adding to history:', transformedEntry); // Debug log
                    addToHistory(transformedEntry);
                    setIsLoading(false); // Set loading to false immediately
                    
                    // Show toast indicating source
                    toast({
                        title: aiData.source === 'ai_generated' ? "Từ vựng mới đã được tạo!" : 
                               aiData.source === 'ai_updated' ? "Đã cập nhật từ vựng!" :
                               "Tìm thấy trong cơ sở dữ liệu",
                        description: aiData.source === 'ai_generated' 
                            ? "AI đã tạo và lưu từ vựng mới vào hệ thống"
                            : aiData.source === 'ai_updated'
                            ? "AI đã bổ sung thông tin chi tiết cho từ vựng này"
                            : "Từ vựng đã có sẵn trong cơ sở dữ liệu",
                        variant: "default",
                    });
                    return; // Return early to avoid finally block
                } else {
                    // AI couldn't find or create the word, try to get suggestions
                    await loadSuggestions(term);
                }
            } else {
                // Handle different error types
                const errorData = await aiResponse.json().catch(() => ({}));
                
                if (aiResponse.status === 400 && errorData.error === 'Giới hạn tìm kiếm') {
                    // Word count limit exceeded
                    toast({
                        title: "Giới hạn tìm kiếm",
                        description: errorData.message || "Chỉ hỗ trợ tìm kiếm tối đa 3 từ trong 1 lần.",
                        variant: "destructive",
                    });
                } else {
                    // General error
                    setNotFound(true);
                    toast({
                        title: "Lỗi tìm kiếm",
                        description: "Không thể tìm kiếm từ vựng. Vui lòng thử lại.",
                        variant: "destructive",
                    });
                }
            }
        } catch (error) {
            console.error('Search error:', error);
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
                        placeholder="Nhập từ tiếng Đức hoặc tiếng Việt (tối đa 3 từ)..."
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    💡 Mẹo: Tìm kiếm tối đa 3 từ trong 1 lần để có kết quả tốt nhất
                </p>
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

            {/* Suggestions */}
            {!isLoading && suggestions && suggestions.length > 0 && (
                <div id="suggestions">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="w-5 h-5" />
                                Có thể bạn muốn tìm
                            </CardTitle>
                            <CardDescription>
                                Tìm thấy {suggestions.length} từ tương tự cho "{searchTerm}"
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {suggestions.map((entry, index) => (
                                <div 
                                    key={entry.id} 
                                    className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                                    onClick={() => {
                                        setSearchTerm(entry.german);
                                        performSearch(entry.german);
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    {entry.german}
                                                </h4>
                                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-full">
                                                    {Math.round(entry.similarity * 100)}% giống
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                {entry.vietnamese}
                                            </p>
                                            {entry.phonetic && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                                    /{entry.phonetic}/
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {entry.type}
                                            </span>
                                            {entry.level && (
                                                <p className="text-xs text-purple-600 dark:text-purple-400">
                                                    {entry.level.displayName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Not Found */}
            {notFound && !suggestions && (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Không tìm thấy kết quả</h3>
                    <p className="text-gray-600 dark:text-gray-300">
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
                                                                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                                                Nhấn để tải từ vựng cho chủ đề này
                                                                            </p>
                                                                        )}
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            ))}
                                                        </Accordion>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic pl-4">
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
