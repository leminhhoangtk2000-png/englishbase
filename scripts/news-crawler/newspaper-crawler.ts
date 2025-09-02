import { spawn } from 'child_process';
import path from 'path';

export interface CrawlResult {
  title: string;
  url: string;
  content: string;
  excerpt?: string;
  authors: string[];
  publish_date?: string;
  source: string;
  word_count: number;
  keywords: string[];
  top_image?: string;
  language: string;
  crawled_at: string;
}

export interface CrawlResponse {
  success: boolean;
  crawled_at: string;
  articles_found: number;
  articles: CrawlResult[];
  error?: string;
}

export class NewspaperCrawler {
  private pythonScript: string;

  constructor() {
    this.pythonScript = path.join(process.cwd(), 'scripts', 'news-crawler', 'crawler.py');
  }

  private async runPythonScript(args: string[]): Promise<CrawlResponse> {
    return new Promise((resolve, reject) => {
      const python = spawn('python3', [this.pythonScript, ...args]);
      
      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          console.error('Python script error:', stderr);
          resolve({
            success: false,
            crawled_at: new Date().toISOString(),
            articles_found: 0,
            articles: [],
            error: stderr || `Python script exited with code ${code}`
          });
          return;
        }

        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (error) {
          console.error('Error parsing Python output:', error);
          resolve({
            success: false,
            crawled_at: new Date().toISOString(),
            articles_found: 0,
            articles: [],
            error: 'Failed to parse crawler output'
          });
        }
      });

      python.on('error', (error) => {
        console.error('Failed to start Python script:', error);
        resolve({
          success: false,
          crawled_at: new Date().toISOString(),
          articles_found: 0,
          articles: [],
          error: `Failed to start Python script: ${error.message}`
        });
      });
    });
  }

  async crawlSingleArticle(url: string, minWords: number = 2000): Promise<CrawlResponse> {
    const args = ['--url', url, '--min-words', minWords.toString()];
    return this.runPythonScript(args);
  }

  async crawlNewsSource(sourceUrl: string, maxArticles: number = 10, minWords: number = 2000): Promise<CrawlResponse> {
    const args = [
      '--source', sourceUrl,
      '--max-articles', maxArticles.toString(),
      '--min-words', minWords.toString()
    ];
    return this.runPythonScript(args);
  }

  async crawlAllSources(maxArticlesPerSource: number = 5, minWords: number = 2000): Promise<CrawlResponse> {
    const args = [
      '--all',
      '--max-articles', maxArticlesPerSource.toString(),
      '--min-words', minWords.toString()
    ];
    return this.runPythonScript(args);
  }
}

// Test the crawler if run directly
if (require.main === module) {
  const crawler = new NewspaperCrawler();
  
  crawler.crawlSingleArticle('https://www.spiegel.de/politik/')
    .then(result => {
      console.log('Crawl result:', JSON.stringify(result, null, 2));
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
