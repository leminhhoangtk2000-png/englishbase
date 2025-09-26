import { notFound, redirect } from "next/navigation";
import { getMarkdownBySlug, markdownToHtml } from "@/lib/markdown";
import { MDXComponentsRenderer } from '@/components/mdx-components-renderer';
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

export default async function AdjektivendungenTeil1Page() {
  const slug = "adjektivendungen/teil1";
  
  try {
    const post = getMarkdownBySlug("a2niveau", "Übungen", slug);
    
    if (!post) {
      notFound();
    }

    const htmlContent = await markdownToHtml(post.content);

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <Link 
            href="/a2niveau/Übungen/adjektivendungen"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Adjektivendungen</span>
          </Link>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>A2 Level</span>
            </div>
            <span>Teil 1 / 4</span>
          </div>
        </div>

        {/* Main Content */}
        <article className="prose prose-lg max-w-none">
          {/* Post Header */}
          <div className="not-prose mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {post.meta.title}
              </h1>
              <p className="text-gray-600 text-lg">
                {post.meta.description}
              </p>
              
              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Level: {post.meta.level}
                </span>
                {post.meta.tags && (
                  <div className="flex gap-1">
                    {post.meta.tags.map((tag: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MDX Content */}
          <MDXComponentsRenderer content={post.content} />
        </article>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t">
          <Link 
            href="/a2niveau/Übungen/adjektivendungen"
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại tổng quan</span>
          </Link>
          
          <div className="text-center text-sm text-gray-500">
            Teil 1 của 4 • Adjektivendungen
          </div>
          
          <Link 
            href="/a2niveau/Übungen/adjektivendungen/teil2"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <span>Teil 2: Nach unbestimmtem Artikel</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading exercise:", error);
    notFound();
  }
}
