'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Newspaper, 
  Clock, 
  RefreshCw, 
  Search, 
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  PlayCircle,
  Eye,
  ExternalLink,
  User,
  Hash,
  Globe,
  Flame,
  Brain,
  Zap,
  Heart
} from "lucide-react";
import { toast } from "sonner";

interface NewsArticle {
  id: string;
  title: string;
  url: string;
  content: string;
  excerpt?: string;
  author?: string;
  publishedAt?: string;
  source: string;
  language: string;
  wordCount: number;
  isActive: boolean;
  difficulty?: string;
  tags: string[];
  // AI analysis fields
  isHot: boolean;
  hotScore?: number;
  aiAnalysis?: string;
  analyzedAt?: string;
  // User preferences
  isFavorite: boolean;
  favoriteAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface CrawlJob {
  id: string;
  source: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  articlesFound: number;
  articlesAdded: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export default function DieNeuenPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [crawlJobs, setCrawlJobs] = useState<CrawlJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingArticleId, setAnalyzingArticleId] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 20;

  useEffect(() => {
    fetchArticles();
    fetchCrawlJobs();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/admin/news-articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const fetchCrawlJobs = async () => {
    try {
      const response = await fetch('/api/admin/crawl-jobs');
      if (response.ok) {
        const data = await response.json();
        setCrawlJobs(data);
      }
    } catch (error) {
      console.error('Error fetching crawl jobs:', error);
    }
  };

  const scheduleFullCrawl = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/schedule-crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Full crawl started: ${data.message}`);
        fetchCrawlJobs();
        // Refresh articles after a delay
        setTimeout(() => {
          fetchArticles();
        }, 10000);
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.message}`);
      }
    } catch (error) {
      toast.error('Failed to start full crawl');
      console.error('Error starting full crawl:', error);
    } finally {
      setLoading(false);
    }
  };

  const crawlSingleSource = async (sourceUrl: string, sourceName: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/crawl-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sources: [sourceUrl],
          maxArticlesPerSource: 5,
          minWords: 2000
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`${sourceName} crawl completed! Found ${result.totalArticles} articles`);
        fetchArticles();
        fetchCrawlJobs();
      } else {
        toast.error(`${sourceName} crawl failed: ` + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed to crawl ${sourceName}`);
    } finally {
      setLoading(false);
    }
  };

  const startCrawl = async (url?: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/crawl-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: url || newUrl,
          minWordCount: 2000 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Crawl job started: ${data.message}`);
        setNewUrl('');
        fetchCrawlJobs();
        // Refresh articles after a delay
        setTimeout(() => {
          fetchArticles();
        }, 5000);
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.message}`);
      }
    } catch (error) {
      toast.error('Failed to start crawl job');
      console.error('Error starting crawl:', error);
    } finally {
      setLoading(false);
    }
  };

  // Favorite Functions
  const toggleFavorite = async (articleId: string) => {
    setAnalyzingArticleId(articleId);
    try {
      const response = await fetch('/api/admin/toggle-favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`${result.article.isFavorite ? '❤️ Added to favorites' : '💔 Removed from favorites'}`);
        fetchArticles(); // Refresh to show updated results
      } else {
        toast.error(`Failed to update favorite: ${result.error}`);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite');
    } finally {
      setAnalyzingArticleId(null);
    }
  };

  const batchAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/admin/batch-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ limit: 10 }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`Batch analysis completed! Analyzed ${result.analyzed} articles, ${result.errors} errors`);
        fetchArticles();
      } else {
        toast.error(`Batch analysis failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error in batch analysis:', error);
      toast.error('Failed to run batch analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const dailyReset = async () => {
    if (!confirm('This will delete all articles older than 24 hours. Continue?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/news-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`Daily reset completed! Deleted ${result.deletedArticles} old articles`);
        fetchArticles();
        fetchCrawlJobs();
      } else {
        toast.error(`Daily reset failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error in daily reset:', error);
      toast.error('Failed to perform daily reset');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Component for displaying full article content
  const ArticleContentModal = ({ article }: { article: NewsArticle }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-left">
            {article.title}
          </DialogTitle>
          <DialogDescription className="text-left">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                {article.source}
              </div>
              <div className="flex items-center gap-1">
                <Hash className="h-4 w-4" />
                {article.wordCount.toLocaleString()} words
              </div>
              {article.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {article.author}
                </div>
              )}
              {article.publishedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(article.publishedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-4">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {article.content}
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <Badge variant={article.isActive ? "default" : "secondary"}>
            {article.isActive ? "Active" : "Inactive"}
          </Badge>
          <Button variant="outline" asChild>
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Original
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'RUNNING':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'COMPLETED' ? 'default' : 
                   status === 'FAILED' ? 'destructive' : 
                   status === 'RUNNING' ? 'secondary' : 'outline';
    return <Badge variant={variant}>{status}</Badge>;
  };

  // Default German news sources
  const defaultSources = [
    'https://www.spiegel.de',
    'https://www.zeit.de',
    'https://www.sueddeutsche.de',
    'https://www.faz.net',
    'https://www.tagesschau.de'
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Newspaper className="h-8 w-8" />
            Die Neuen
          </h1>
          <p className="mt-1 text-muted-foreground">
            Crawl German newspaper articles automatically at 7 AM and 6 PM daily
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => fetchArticles()}
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={batchAnalyze}
            disabled={analyzing}
            variant="outline"
          >
            {analyzing ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            AI Analysis
          </Button>
          <Button
            onClick={dailyReset}
            disabled={loading}
            variant="outline"
          >
            <Zap className="h-4 w-4 mr-2" />
            Daily Reset
          </Button>
          <Button
            onClick={scheduleFullCrawl}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Clock className="h-4 w-4 mr-2" />
            )}
            Run All Sources
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground">
              {articles.filter(a => a.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Crawls</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {crawlJobs.filter(job => 
                new Date(job.startedAt).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Next: 7:00 AM / 6:00 PM
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {crawlJobs.length > 0 
                ? Math.round((crawlJobs.filter(j => j.status === 'COMPLETED').length / crawlJobs.length) * 100)
                : 0
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Words Crawled</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {articles.reduce((sum, article) => sum + article.wordCount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Min 2000 per article
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Manual Crawl Section */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Crawl</CardTitle>
          <CardDescription>
            Start a manual crawl job or use quick actions for popular German news sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="crawl-url">News Source URL</Label>
              <Input
                id="crawl-url"
                placeholder="https://www.spiegel.de or specific article URL"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => startCrawl()}
                disabled={loading || !newUrl}
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <PlayCircle className="h-4 w-4 mr-2" />
                )}
                Start Crawl
              </Button>
            </div>
          </div>

          <div>
            <Label>Quick Actions - Popular German News Sources:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {defaultSources.map((source) => (
                <Button
                  key={source}
                  variant="outline"
                  size="sm"
                  onClick={() => startCrawl(source)}
                  disabled={loading}
                >
                  {source.replace('https://www.', '').replace('https://', '')}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Crawl Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Crawl Sources</CardTitle>
          <CardDescription>
            Crawl individual German news sources instantly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Der Spiegel', url: 'https://www.spiegel.de', color: 'bg-red-500' },
              { name: 'Die Zeit', url: 'https://www.zeit.de', color: 'bg-gray-700' },
              { name: 'Süddeutsche', url: 'https://www.sueddeutsche.de', color: 'bg-blue-600' },
              { name: 'FAZ', url: 'https://www.faz.net', color: 'bg-orange-600' },
              { name: 'Tagesschau', url: 'https://www.tagesschau.de', color: 'bg-blue-700' },
              { name: 'Die Welt', url: 'https://www.welt.de', color: 'bg-gray-800' }
            ].map((source) => (
              <Button
                key={source.url}
                onClick={() => crawlSingleSource(source.url, source.name)}
                disabled={loading}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2"
              >
                <div className="flex items-center gap-2 w-full">
                  <div className={`w-3 h-3 rounded-full ${source.color}`} />
                  <span className="font-medium">{source.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Click to crawl latest articles
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Crawl Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Crawl Jobs</CardTitle>
          <CardDescription>
            Status and results of recent crawling operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Found</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crawlJobs.slice(0, 10).map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      {getStatusBadge(job.status)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{job.source}</TableCell>
                  <TableCell>{job.articlesFound}</TableCell>
                  <TableCell>{job.articlesAdded}</TableCell>
                  <TableCell>
                    {new Date(job.startedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {job.completedAt 
                      ? new Date(job.completedAt).toLocaleString()
                      : '-'
                    }
                  </TableCell>
                </TableRow>
              ))}
              {crawlJobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No crawl jobs yet. Start your first crawl above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Crawled Articles</CardTitle>
          <CardDescription>
            German news articles with more than 2000 characters ({filteredArticles.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles by title or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Hot</TableHead>
                <TableHead>Words</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div>
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium hover:underline line-clamp-2"
                      >
                        {article.title}
                      </a>
                      {article.author && (
                        <p className="text-sm text-muted-foreground">by {article.author}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{article.source}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {article.isHot && (
                        <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
                          <Flame className="h-3 w-3 mr-1" />
                          HOT
                        </Badge>
                      )}
                      {article.hotScore && (
                        <span className="text-xs text-muted-foreground">
                          {(article.hotScore * 100).toFixed(0)}%
                        </span>
                      )}
                      {!article.analyzedAt && (
                        <Badge variant="outline" className="text-xs">
                          Not analyzed
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {article.wordCount.toLocaleString()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {article.publishedAt 
                      ? new Date(article.publishedAt).toLocaleDateString()
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={article.isActive ? "default" : "secondary"}>
                      {article.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ArticleContentModal article={article} />
                      <Button variant="ghost" size="sm" asChild>
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleFavorite(article.id)}
                        disabled={analyzingArticleId === article.id}
                      >
                        {analyzingArticleId === article.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Heart className={`h-4 w-4 ${article.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {currentArticles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No articles match your search.' : 'No articles crawled yet.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredArticles.length)} of {filteredArticles.length} articles
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNumber}
                        variant={pageNumber === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
