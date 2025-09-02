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
import { 
  Newspaper, 
  Clock, 
  RefreshCw, 
  Search, 
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  PlayCircle
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
  wordCount: number;
  isActive: boolean;
  difficulty?: string;
  tags: string[];
  createdAt: string;
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

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.source.toLowerCase().includes(searchTerm.toLowerCase())
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
            German news articles with more than 2000 characters
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
                <TableHead>Words</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.slice(0, 20).map((article) => (
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
                </TableRow>
              ))}
              {filteredArticles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No articles match your search.' : 'No articles crawled yet.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
