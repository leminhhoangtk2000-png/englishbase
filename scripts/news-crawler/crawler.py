#!/usr/bin/env python3
"""
German News Crawler using newspaper3k
Crawls German news websites and returns structured article data
"""

import sys
import json
import argparse
from newspaper import Article, Source
from datetime import datetime
import re
import time
import requests
from urllib.parse import urljoin, urlparse
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class GermanNewsCrawler:
    def __init__(self, min_word_count=2000):
        self.min_word_count = min_word_count
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # German news sources
        self.german_sources = {
            'spiegel.de': 'Der Spiegel',
            'zeit.de': 'Die Zeit', 
            'sueddeutsche.de': 'Süddeutsche Zeitung',
            'faz.net': 'Frankfurter Allgemeine Zeitung',
            'tagesschau.de': 'Tagesschau',
            'welt.de': 'Die Welt',
            'focus.de': 'Focus',
            'bild.de': 'Bild',
            'handelsblatt.com': 'Handelsblatt',
            'tagesspiegel.de': 'Der Tagesspiegel'
        }

    def get_source_name(self, url):
        """Extract source name from URL"""
        try:
            domain = urlparse(url).netloc.lower()
            if domain.startswith('www.'):
                domain = domain[4:]
            
            return self.german_sources.get(domain, domain)
        except:
            return 'Unknown'

    def is_valid_german_article(self, article):
        """Check if article is valid German content"""
        if not article.text or len(article.text.strip()) < self.min_word_count:
            return False
            
        # Basic German text detection
        german_indicators = ['der', 'die', 'das', 'und', 'ist', 'sich', 'mit', 'für', 'auf', 'von', 'zu', 'eine', 'einen', 'einer']
        text_lower = article.text.lower()
        
        found_indicators = sum(1 for indicator in german_indicators if indicator in text_lower)
        return found_indicators >= 3

    def crawl_single_article(self, url):
        """Crawl a single article using newspaper3k"""
        try:
            logger.info(f"Crawling article: {url}")
            
            article = Article(url, language='de')
            article.set_headers(self.headers)
            
            # Download and parse article
            article.download()
            article.parse()
            
            # Extract additional info
            article.nlp()
            
            # Validate article
            if not self.is_valid_german_article(article):
                logger.warning(f"Article failed validation: {url}")
                return None
            
            # Prepare result
            result = {
                'title': article.title.strip() if article.title else '',
                'url': url,
                'content': article.text.strip() if article.text else '',
                'excerpt': article.summary[:300] + '...' if article.summary and len(article.summary) > 300 else article.summary,
                'authors': article.authors if article.authors else [],
                'publish_date': article.publish_date.isoformat() if article.publish_date else None,
                'source': self.get_source_name(url),
                'word_count': len(article.text) if article.text else 0,
                'keywords': list(article.keywords) if article.keywords else [],
                'top_image': article.top_image if article.top_image else None,
                'language': 'de',
                'crawled_at': datetime.now().isoformat()
            }
            
            logger.info(f"Successfully crawled: {article.title} ({result['word_count']} chars)")
            return result
            
        except Exception as e:
            logger.error(f"Error crawling article {url}: {str(e)}")
            return None

    def crawl_news_source(self, source_url, max_articles=10):
        """Crawl multiple articles from a news source"""
        try:
            logger.info(f"Crawling news source: {source_url}")
            
            # Create newspaper Source object
            source = Source(source_url, language='de')
            source.set_headers(self.headers)
            
            # Build the source (find all articles)
            source.build()
            
            articles = []
            article_urls = list(source.articles)[:max_articles]
            
            logger.info(f"Found {len(article_urls)} articles from {source_url}")
            
            for i, article in enumerate(article_urls):
                if i >= max_articles:
                    break
                    
                try:
                    # Download and parse article
                    article.download()
                    article.parse()
                    article.nlp()
                    
                    # Validate article
                    if not self.is_valid_german_article(article):
                        continue
                    
                    # Prepare result
                    result = {
                        'title': article.title.strip() if article.title else '',
                        'url': article.url,
                        'content': article.text.strip() if article.text else '',
                        'excerpt': article.summary[:300] + '...' if article.summary and len(article.summary) > 300 else article.summary,
                        'authors': article.authors if article.authors else [],
                        'publish_date': article.publish_date.isoformat() if article.publish_date else None,
                        'source': self.get_source_name(source_url),
                        'word_count': len(article.text) if article.text else 0,
                        'keywords': list(article.keywords) if article.keywords else [],
                        'top_image': article.top_image if article.top_image else None,
                        'language': 'de',
                        'crawled_at': datetime.now().isoformat()
                    }
                    
                    articles.append(result)
                    logger.info(f"Crawled: {article.title} ({result['word_count']} chars)")
                    
                    # Be respectful - add delay
                    time.sleep(1)
                    
                except Exception as e:
                    logger.error(f"Error processing article {article.url}: {str(e)}")
                    continue
            
            return articles
            
        except Exception as e:
            logger.error(f"Error crawling source {source_url}: {str(e)}")
            return []

    def crawl_all_sources(self, max_articles_per_source=5):
        """Crawl all German news sources"""
        all_articles = []
        
        source_urls = [
            'https://www.spiegel.de',
            'https://www.zeit.de', 
            'https://www.sueddeutsche.de',
            'https://www.faz.net',
            'https://www.tagesschau.de',
            'https://www.welt.de',
            'https://www.focus.de'
        ]
        
        for source_url in source_urls:
            try:
                articles = self.crawl_news_source(source_url, max_articles_per_source)
                all_articles.extend(articles)
                
                # Add delay between sources
                time.sleep(2)
                
            except Exception as e:
                logger.error(f"Failed to crawl {source_url}: {str(e)}")
                continue
        
        return all_articles

def main():
    parser = argparse.ArgumentParser(description='German News Crawler using newspaper3k')
    parser.add_argument('--url', type=str, help='Single URL to crawl')
    parser.add_argument('--source', type=str, help='News source to crawl (e.g., https://www.spiegel.de)')
    parser.add_argument('--all', action='store_true', help='Crawl all German news sources')
    parser.add_argument('--max-articles', type=int, default=10, help='Maximum articles per source')
    parser.add_argument('--min-words', type=int, default=2000, help='Minimum word count for articles')
    parser.add_argument('--output', type=str, help='Output JSON file')
    
    args = parser.parse_args()
    
    crawler = GermanNewsCrawler(min_word_count=args.min_words)
    
    articles = []
    
    if args.url:
        # Crawl single article
        article = crawler.crawl_single_article(args.url)
        if article:
            articles.append(article)
    elif args.source:
        # Crawl single source
        articles = crawler.crawl_news_source(args.source, args.max_articles)
    elif args.all:
        # Crawl all sources
        articles = crawler.crawl_all_sources(args.max_articles)
    else:
        parser.print_help()
        return
    
    # Output results
    result = {
        'success': True,
        'crawled_at': datetime.now().isoformat(),
        'articles_found': len(articles),
        'articles': articles
    }
    
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
