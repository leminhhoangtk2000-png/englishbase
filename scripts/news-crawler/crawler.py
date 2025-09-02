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
import feedparser
import ssl

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class GermanNewsCrawler:
    def __init__(self, min_word_count=2000):
        self.min_word_count = min_word_count
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Bypass SSL verification for testing
        ssl._create_default_https_context = ssl._create_unverified_context
        
        # German news sources with RSS feeds
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
        
        # RSS feed URLs for German news sources
        self.rss_feeds = {
            'spiegel.de': 'https://www.spiegel.de/schlagzeilen/index.rss',
            'zeit.de': 'https://newsfeed.zeit.de/index',
            'sueddeutsche.de': 'https://rss.sueddeutsche.de/rss/Topthemen',
            'faz.net': 'https://www.faz.net/rss/aktuell/',
            'tagesschau.de': 'https://www.tagesschau.de/xml/rss2/',
            'welt.de': 'https://www.welt.de/feeds/latest.rss',
        }

    def get_rss_feed_for_source(self, source_url):
        """Get RSS feed URL for a given source"""
        try:
            domain = urlparse(source_url).netloc.lower()
            if domain.startswith('www.'):
                domain = domain[4:]
            
            return self.rss_feeds.get(domain, None)
        except:
            return None

    def crawl_rss_feed(self, rss_url, source_name, max_articles=10):
        """Crawl articles from RSS feed"""
        try:
            logger.info(f"Parsing RSS feed: {rss_url}")
            feed = feedparser.parse(rss_url)
            
            articles = []
            processed_count = 0
            
            for entry in feed.entries:
                if processed_count >= max_articles:
                    break
                
                try:
                    # Get article URL
                    article_url = entry.link
                    
                    # Crawl the individual article
                    article_data = self.crawl_single_article(article_url)
                    
                    if article_data:
                        # Override source name with provided source
                        article_data['source'] = source_name
                        articles.append(article_data)
                        processed_count += 1
                        
                        logger.info(f"RSS: Processed article: {article_data['title']} ({article_data['word_count']} words)")
                    
                    # Be respectful with delays
                    time.sleep(1)
                    
                except Exception as e:
                    logger.error(f"Error processing RSS entry {entry.link}: {e}")
                    continue
            
            logger.info(f"Found {len(articles)} articles from RSS feed")
            return articles
            
        except Exception as e:
            logger.error(f"Error parsing RSS feed {rss_url}: {e}")
            return []

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
            
            # Set config with headers
            from newspaper.configuration import Configuration
            config = Configuration()
            config.browser_user_agent = self.headers['User-Agent']
            config.request_timeout = 30
            article.config = config
            
            # Download and parse article
            article.download()
            article.parse()
            
            # Skip NLP for now to avoid NLTK dependency issues
            # article.nlp()
            
            # Validate article
            if not self.is_valid_german_article(article):
                logger.warning(f"Article failed validation: {url}")
                return None
            
            # Prepare result
            result = {
                'title': article.title.strip() if article.title else '',
                'url': url,
                'content': article.text.strip() if article.text else '',
                'excerpt': article.text[:300] + '...' if article.text and len(article.text) > 300 else article.text,
                'authors': article.authors if article.authors else [],
                'publish_date': article.publish_date.isoformat() if article.publish_date else None,
                'source': self.get_source_name(url),
                'word_count': len(article.text) if article.text else 0,
                'keywords': [],  # Skip keywords for now
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
        """Crawl multiple articles from a news source, trying RSS first"""
        try:
            logger.info(f"Crawling news source: {source_url}")
            
            # Try RSS feed first
            rss_url = self.get_rss_feed_for_source(source_url)
            source_name = self.get_source_name(source_url)
            
            if rss_url:
                logger.info(f"Using RSS feed for {source_name}: {rss_url}")
                articles = self.crawl_rss_feed(rss_url, source_name, max_articles)
                if articles:
                    return articles
                else:
                    logger.warning(f"RSS feed failed, falling back to direct crawling for {source_url}")
            
            # Fallback to direct source crawling (original method)
            return self.crawl_news_source_direct(source_url, max_articles)
            
        except Exception as e:
            logger.error(f"Error crawling source {source_url}: {str(e)}")
            return []

    def crawl_news_source_direct(self, source_url, max_articles=10):
        """Crawl multiple articles from a news source using direct method"""
        try:
            logger.info(f"Direct crawling news source: {source_url}")
            
            # Create newspaper Source object
            from newspaper.configuration import Configuration
            config = Configuration()
            config.browser_user_agent = self.headers['User-Agent']
            config.request_timeout = 30
            
            source = Source(source_url, language='de', config=config)
            
            # Build the source (find all articles)
            source.build()
            
            articles = []
            article_urls = list(source.articles)[:max_articles]
            
            logger.info(f"Found {len(article_urls)} articles from {source_url}")
            
            for i, article in enumerate(article_urls):
                if i >= max_articles:
                    break
                    
                try:
                    # Set config for each article
                    article.config = config
                    
                    # Download and parse article
                    article.download()
                    article.parse()
                    # Skip NLP for now
                    # article.nlp()
                    
                    # Validate article
                    if not self.is_valid_german_article(article):
                        continue
                    
                    # Prepare result
                    result = {
                        'title': article.title.strip() if article.title else '',
                        'url': article.url,
                        'content': article.text.strip() if article.text else '',
                        'excerpt': article.text[:300] + '...' if article.text and len(article.text) > 300 else article.text,
                        'authors': article.authors if article.authors else [],
                        'publish_date': article.publish_date.isoformat() if article.publish_date else None,
                        'source': self.get_source_name(source_url),
                        'word_count': len(article.text) if article.text else 0,
                        'keywords': [],  # Skip keywords for now
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
