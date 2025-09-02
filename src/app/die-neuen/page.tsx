'use client';

import { useState, useEffect } from 'react';
import { MainNav } from '@/components/main-nav';
import { 
  DieNeuenHeader,
  CategoryFilter,
  SearchResultsInfo,
  ArticleCard,
  Pagination,
  Sidebar,
  LoadingSpinner,
  LoadingGrid,
  type NewsArticle,
  mockArticles 
} from '@/components/die-neuen';
import { Button } from '@/components/ui/button';

export default function DieNeuen() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ARTICLES_PER_PAGE = 8;

  useEffect(() => {
    fetchArticles();
    
    // Keyboard shortcut for search (Ctrl/Cmd + K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
        // Focus search input after state update
        setTimeout(() => {
          const searchInput = document.querySelector('input[placeholder="Artikel suchen..."]') as HTMLInputElement;
          if (searchInput) searchInput.focus();
        }, 100);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setArticles(mockArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <DieNeuenHeader 
          searchTerm={searchTerm}
          showSearch={showSearch}
          selectedCategory={selectedCategory}
          setSearchTerm={setSearchTerm}
          setShowSearch={setShowSearch}
          setSelectedCategory={setSelectedCategory}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <div className="lg:col-span-3 space-y-6">
            <CategoryFilter 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            
            <SearchResultsInfo 
              filteredCount={filteredArticles.length}
              totalCount={mockArticles.length}
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              currentPage={currentPage}
              totalPages={totalPages}
              articlesPerPage={ARTICLES_PER_PAGE}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
          
          <Sidebar 
            articles={mockArticles}
            filteredArticles={filteredArticles}
            currentPage={currentPage}
            totalPages={totalPages}
            articlesPerPage={ARTICLES_PER_PAGE}
          />
        </div>
      </div>
    </div>
  );
}
