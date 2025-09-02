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
  const [interestingArticles, setInterestingArticles] = useState<NewsArticle[]>([]);
  const [crawlJobs, setCrawlJobs] = useState<CrawlJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [analyzingVietnamese, setAnalyzingVietnamese] = useState(false);
  const [analyzingArticleId, setAnalyzingArticleId] = useState<string | null>(null);
  const [schedulerActive, setSchedulerActive] = useState(false);
  const [schedulerLoading, setSchedulerLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [favCurrentPage, setFavCurrentPage] = useState(1);
  const articlesPerPage = 20;

  useEffect(() => {
    fetchArticles();
    fetchInterestingArticles();
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

  const fetchInterestingArticles = async () => {
    try {
      const response = await fetch('/api/admin/news-articles?interesting=true');
      if (response.ok) {
        const data = await response.json();
        setInterestingArticles(data);
      }
    } catch (error) {
      console.error('Error fetching interesting articles:', error);
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
        fetchArticles(); // Refresh main articles table
        // Note: No longer fetching favorite articles since we use interesting articles instead
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

  const batchAnalyzeForVietnamese = async () => {
    setAnalyzingVietnamese(true);
    try {
      toast.info('Starting AI analysis for Vietnamese learners...');
      
      const response = await fetch('/api/admin/batch-analyze-vietnamese', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`✅ Analysis completed! Analyzed ${result.analyzed} articles, found ${result.interesting} interesting ones`);
        fetchArticles();
        fetchInterestingArticles();
      } else {
        toast.error(`Analysis failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error in batch analysis:', error);
      toast.error('Failed to analyze articles');
    } finally {
      setAnalyzingVietnamese(false);
    }
  };

  const toggleScheduler = async () => {
    setSchedulerLoading(true);
    try {
      const action = schedulerActive ? 'stop' : 'start';
      const response = await fetch('/api/admin/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action })
      });

      const result = await response.json();
      
      if (result.success) {
        setSchedulerActive(!schedulerActive);
        if (action === 'start') {
          toast.success('🕰️ Auto-scheduler started! Crawling at 7 AM, cleanup at midnight');
        } else {
          toast.success('⏹️ Auto-scheduler stopped');
        }
      } else {
        toast.error(`Scheduler ${action} failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error toggling scheduler:', error);
      toast.error('Failed to toggle scheduler');
    } finally {
      setSchedulerLoading(false);
    }
  };

  const checkSchedulerStatus = async () => {
    try {
      const response = await fetch('/api/admin/scheduler');
      const result = await response.json();
      setSchedulerActive(result.activeTasks > 0);
    } catch (error) {
      console.error('Error checking scheduler status:', error);
    }
  };

  // Check scheduler status on component mount
  useEffect(() => {
    checkSchedulerStatus();
  }, []);

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
            Automated news crawling at 7:00 AM daily, automatic cleanup at midnight
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
            onClick={batchAnalyzeForVietnamese}
            disabled={analyzingVietnamese}
            variant="outline"
          >
            {analyzingVietnamese ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            Auto-Analyze for Vietnamese
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
          <Button
            onClick={toggleScheduler}
            disabled={schedulerLoading}
            variant={schedulerActive ? "default" : "outline"}
            className={schedulerActive ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {schedulerLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : schedulerActive ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : (
              <Clock className="h-4 w-4 mr-2" />
            )}
            {schedulerActive ? 'Auto-Schedule ON' : 'Start Auto-Schedule'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Schedule</CardTitle>
            {schedulerActive ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Clock className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schedulerActive ? 'ACTIVE' : 'OFF'}
            </div>
            <p className="text-xs text-muted-foreground">
              {schedulerActive ? '7 AM crawl, 12 AM cleanup' : 'Manual mode'}
            </p>
          </CardContent>
        </Card>

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

      {/* Interesting Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Interesting Articles
          </CardTitle>
          <CardDescription>
            AI-curated articles interesting for Vietnamese learners studying German ({interestingArticles.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {interestingArticles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No interesting articles found yet.</p>
              <p className="text-sm">AI will analyze and curate articles after crawling.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Interest Score</TableHead>
                    <TableHead>Words</TableHead>
                    <TableHead>Analyzed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interestingArticles
                    .slice((favCurrentPage - 1) * articlesPerPage, favCurrentPage * articlesPerPage)
                    .map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="max-w-md">
                        <div className="space-y-1">
                          <p className="font-medium line-clamp-2">{article.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {article.excerpt}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          <span className="text-xs">{article.source}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {article.isHot && (
                          <div className="flex items-center gap-1">
                            <Brain className="h-4 w-4 text-purple-500" />
                            <span className="text-xs font-medium text-purple-600">
                              {article.hotScore}/10
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs">{article.wordCount}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {article.analyzedAt ? new Date(article.analyzedAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(article.url, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Interesting Articles Pagination */}
              {interestingArticles.length > articlesPerPage && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((favCurrentPage - 1) * articlesPerPage) + 1} to {Math.min(favCurrentPage * articlesPerPage, interestingArticles.length)} of {interestingArticles.length} interesting articles
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFavCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={favCurrentPage === 1}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, Math.ceil(interestingArticles.length / articlesPerPage)) }, (_, i) => {
                        const favTotalPages = Math.ceil(interestingArticles.length / articlesPerPage);
                        let pageNumber;
                        
                        if (favTotalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (favCurrentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (favCurrentPage >= favTotalPages - 2) {
                          pageNumber = favTotalPages - 4 + i;
                        } else {
                          pageNumber = favCurrentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNumber}
                            variant={pageNumber === favCurrentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFavCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFavCurrentPage(prev => Math.min(prev + 1, Math.ceil(interestingArticles.length / articlesPerPage)))}
                      disabled={favCurrentPage === Math.ceil(interestingArticles.length / articlesPerPage)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
