export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  featured: boolean;
  wordCount: number;
  imageUrl?: string;
}

export interface DieNeuenProps {
  articles: NewsArticle[];
  loading: boolean;
  selectedCategory: string;
  searchTerm: string;
  showSearch: boolean;
  currentPage: number;
  setSelectedCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  setShowSearch: (show: boolean) => void;
  setCurrentPage: (page: number) => void;
}
