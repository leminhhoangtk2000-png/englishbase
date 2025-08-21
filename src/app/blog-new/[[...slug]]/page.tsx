import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDocFromParams } from "@/lib/blog-new";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, MessageCircle, MoreHorizontal, BarChart2, Linkedin, Twitter, Facebook, Link as LinkIcon, Star, Mic, PlayCircle } from "lucide-react";
import { AuthorInfo } from "../_components/author-info";

interface DocPageProps {
  params: {
    slug: string[];
  };
}

// --- Start of data for the blog list page ---
const articles = [
  {
    author: "Sejalbaranwal",
    publication: "LearnToProfit.com",
    avatar: "https://placehold.co/40x40.png",
    title: "I Use These 5 ChatGPT Prompts Daily - You'll Wish You Knew These Sooner",
    excerpt: "There's always a need to understand the truth. But sometimes, it hits you only after you have wasted a whole month.",
    image: "https://placehold.co/200x134.png",
    data_ai_hint: "ai prompts",
    date: "Jul 29",
    readTime: "2.1K",
    comments: 70,
  },
  {
    author: "Ossai Chinedum",
    publication: "In Long. Sweet. Valuable.",
    avatar: "https://placehold.co/40x40.png",
    title: "I'll Instantly Know You Used Chat Gpt If I See This",
    excerpt: "Trust me you're not as slick as you think",
    image: "https://placehold.co/200x134.png",
    data_ai_hint: "desk lamp",
    date: "May 16",
    readTime: "20K",
    comments: 1237,
  },
  {
    author: "Anthony Lam",
    publication: "",
    avatar: "https://placehold.co/40x40.png",
    title: "I Tried 19 Side Hustles. Here's What Actually Made Me Money (And What Sucked)",
    excerpt: "Some Are Sketchy",
    image: "https://placehold.co/200x134.png",
    data_ai_hint: "woman laptop",
    date: "May 26",
    readTime: "2.2K",
    comments: 73,
  },
  {
    author: "John Ozuwe",
    publication: "In Readers Club",
    avatar: "https://placehold.co/40x40.png",
    title: "If You Can Copy and paste, You Can get paid $500/Week",
    excerpt: "Turn simple copy-paste tasks into a steady $500-a-week income, no special skills required.",
    image: "https://placehold.co/200x134.png",
    data_ai_hint: "man window",
    date: "Aug 11",
    readTime: "942",
    comments: 32,
  },
];

const staffPicks = [
  {
    author: "Ninad Kulkarni",
    publication: "In Sharing Food",
    title: "Eating With My Hands Doesn't Make Me Less Civilised",
    avatar: "https://placehold.co/24x24.png",
    date: "Jul 4",
  },
  {
    author: "Jim Parton",
    publication: "In The Wind Phone",
    title: "You Are Dead: What Happens Next?",
    avatar: "https://placehold.co/24x24.png",
    date: "Jun 21",
  },
  {
    author: "Michelle Glauser",
    publication: "",
    title: "How the #ILookLikeAnEngineer Ad Campaign Happened Ten Years Ago",
    avatar: "https://placehold.co/24x24.png",
    date: "Aug 3",
  },
];

const recommendedTopics = [
  "Programming",
  "Writing",
  "Self Improvement",
  "Data Science",
  "Politics",
  "Cryptocurrency",
  "Productivity",
];

const whoToFollow = [
  {
    name: "Ricky Lanusse",
    bio: "Patagonian skipping stones professional...",
    avatar: "https://placehold.co/48x48.png",
  },
  {
    name: "LearnAltoprofit.com",
    bio: "Artificial Intelligence Tools For Writers. How to use ...",
    avatar: "https://placehold.co/48x48.png",
  },
  {
    name: "Jason McBride",
    bio: "Freelance Copywriter | Poet | Illustrator | Amate...",
    avatar: "https://placehold.co/48x48.png",
  },
];
// --- End of data for the blog list page ---

function BlogListPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="border-b">
        <div className="flex items-center space-x-6 text-sm text-muted-foreground overflow-x-auto pb-3">
          <Link href="#" className="text-foreground font-semibold">+</Link>
          <Link href="#" className="text-foreground font-semibold">For you</Link>
          <Link href="#" className="hover:text-foreground">Following</Link>
          <Link href="#" className="hover:text-foreground">Featured</Link>
          <Link href="#" className="hover:text-foreground">Web Development</Link>
          <Link href="#" className="hover:text-foreground">Books</Link>
          <Link href="#" className="hover:text-foreground">Marketing</Link>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        <div className="lg:col-span-2">
          {articles.map((article, index) => (
            <div key={index} className="mb-10">
              <div className="flex items-center text-sm mb-2">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={article.avatar} alt={article.author} />
                  <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{article.author}</span>
                {article.publication && <span className="text-muted-foreground ml-1">in {article.publication}</span>}
              </div>
              <div className="flex justify-between gap-8">
                <div>
                  <h2 className="text-xl font-bold mb-2 font-headline">
                    <Link href="/blog-new/first-post">{article.title}</Link>
                  </h2>
                  <p className="hidden md:block text-muted-foreground mb-4">{article.excerpt}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{article.date}</span>
                    <span className="mx-2">·</span>
                    <span>{article.readTime} reads</span>
                    <span className="mx-2">·</span>
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span>{article.comments}</span>
                    <div className="flex-grow" />
                    <div className="flex items-center gap-4">
                      <button className="hover:text-foreground"><BarChart2 className="w-5 h-5" /></button>
                      <button className="hover:text-foreground"><Bookmark className="w-5 h-5" /></button>
                      <button className="hover:text-foreground"><MoreHorizontal className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>
                <Image
                  src={article.image}
                  alt={article.title}
                  width={200}
                  height={134}
                  data-ai-hint={article.data_ai_hint}
                  className="hidden sm:block object-cover"
                />
              </div>
              <Separator className="mt-8" />
            </div>
          ))}
        </div>

        <aside className="lg:col-span-1 lg:border-l lg:pl-8">
          <h3 className="font-semibold mb-4">Staff Picks</h3>
          <div className="space-y-4">
            {staffPicks.map((pick, index) => (
              <div key={index}>
                <div className="flex items-center text-sm mb-1">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={pick.avatar} alt={pick.author} />
                    <AvatarFallback>{pick.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{pick.author}</span>
                  {pick.publication && <span className="text-muted-foreground ml-1">{pick.publication}</span>}
                </div>
                <h4 className="font-bold">
                  <Link href="/blog-new/first-post">{pick.title}</Link>
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{pick.date}</p>
              </div>
            ))}
            <Link href="#" className="text-sm text-primary hover:underline">See the full list</Link>
          </div>

          <Separator className="my-8" />

          <h3 className="font-semibold mb-4">Recommended topics</h3>
          <div className="flex flex-wrap gap-2">
            {recommendedTopics.map((topic) => (
              <Badge key={topic} variant="secondary" className="px-3 py-1 rounded-full cursor-pointer hover:bg-muted">{topic}</Badge>
            ))}
          </div>
          <Link href="#" className="text-sm text-primary hover:underline mt-4 inline-block">See more topics</Link>

          <Separator className="my-8" />

          <h3 className="font-semibold mb-4">Who to follow</h3>
          <div className="space-y-4">
            {whoToFollow.map((person, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={person.avatar} alt={person.name} />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{person.name}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[150px]">{person.bio}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">Follow</Button>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

const authorDetails = {
  name: "Justis Earle",
  publication: "The Startup",
  avatar: "https://placehold.co/48x48.png",
  bio: "Writer and illustrator. Follow my newsletter: https://thestartup.info",
  claps: 240,
  comments: 177
};

const commentsData = [
    {
        author: "Carl Cort",
        avatar: "https://placehold.co/32x32.png",
        text: "I used to be a doom-scroller and these apps really helped me to break the habit. Thanks for sharing!",
        claps: 2,
        date: "2 mo ago"
    },
    {
        author: "J.P. Lamborn",
        avatar: "https://placehold.co/32x32.png",
        text: "Great list! I'd also add 'Readwise' to the list. It's a great app for saving and revisiting highlights from articles and books.",
        claps: 1,
        date: "1 mo ago"
    }
]

export default async function DocPage({ params }: DocPageProps) {
  // If there's no slug, it's the blog's main page.
  if (!params.slug || params.slug.length === 0) {
    return <BlogListPage />;
  }

  const doc = await getDocFromParams({ params });

  if (!doc || !doc.component) {
    notFound();
  }

  const ContentComponent = doc.component;

  return (
    <main className="relative py-6 lg:py-8 font-serif">
      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="flex justify-between items-start mb-4">
            <div className="text-sm">
                <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={authorDetails.avatar} alt={authorDetails.name} />
                        <AvatarFallback>{authorDetails.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{authorDetails.name} in <span className="text-primary">{authorDetails.publication}</span></p>
                        <p className="text-muted-foreground">Published on Aug 12 · 7 min read</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
                <button className="hover:text-foreground"><Linkedin className="w-5 h-5" /></button>
                <button className="hover:text-foreground"><Twitter className="w-5 h-5" /></button>
                <button className="hover:text-foreground"><Facebook className="w-5 h-5" /></button>
                <button className="hover:text-foreground"><LinkIcon className="w-5 h-5" /></button>
            </div>
        </div>
        
        <Separator className="my-6" />

        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-center lg:text-5xl font-headline">{doc.title}</h1>
          {doc.description && (
            <p className="text-xl text-muted-foreground text-center">{doc.description}</p>
          )}
        </div>

        <AuthorInfo author={authorDetails} />

        <div className="my-8">
            <Image 
                src="https://placehold.co/800x500.png" 
                alt={doc.title}
                width={800}
                height={500}
                data-ai-hint="colorful illustration"
                className="w-full object-cover rounded-md"
            />
        </div>

        <div className="prose prose-stone dark:prose-invert max-w-none mx-auto text-lg prose-p:leading-8 prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-2xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1">
          <ContentComponent />
        </div>
        
        <Separator className="my-12" />

        <div className="space-y-8">
            <h2 className="text-2xl font-bold font-headline">Responses ({commentsData.length})</h2>

            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="Current User"/>
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <p className="text-muted-foreground">What are your thoughts?</p>
                </div>
            </div>

            <div className="space-y-6">
                {commentsData.map((comment, index) => (
                    <div key={index}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={comment.avatar} alt={comment.author}/>
                                    <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{comment.author}</p>
                                    <p className="text-xs text-muted-foreground">{comment.date}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4"/>
                            </Button>
                        </div>
                        <p className="mt-3 text-muted-foreground">{comment.text}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                            <div className="flex items-center gap-1">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.9l.7-2.94c.04-.18.23-.29.4-.25l.26.05c.17.03.29.2.25.38l-.7 2.93-1.9.83zm-3.84 0l-1.9-.83.7-2.94c.04-.18.23-.29.4-.25l.26.05c.17.03.29.2.25.38l-.7 2.93zM20.08 11c.45-.42.72-1.03.72-1.69 0-1.33-1.08-2.41-2.42-2.41-1.33 0-2.41 1.08-2.41 2.41 0 .31.06.6.17.86l-3.2 3.2-3.2-3.2c.1-.26.17-.55.17-.86 0-1.33-1.08-2.41-2.42-2.41-1.33 0-2.41 1.08-2.41 2.41 0 .66.27 1.27.72 1.69C2.18 12.55 1 15.89 1 19.52V20h1.52c0-3.52 2.92-6.38 6.5-6.38s6.5 2.86 6.5 6.38H23v-.48c0-3.63-1.18-6.97-3.92-8.52z" fill="currentColor"></path></svg>
                                <span>{comment.claps}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageCircle className="w-4 h-4" />
                                <span>Reply</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             <Button variant="outline" className="rounded-full">Show more responses</Button>
        </div>

        <Separator className="my-12" />

        <div>
            <h3 className="font-semibold mb-4">More from The Startup and Deutsch.vn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">The Startup</p>
                    <h4 className="font-bold">12 New iOS Features That Will Change the Way You Use Your iPhone</h4>
                    <p className="text-sm text-muted-foreground">The May 12, 2024 iOS update comes with a lot of new things...</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                        <span>May 12</span>
                        <span>·</span>
                        <span>5 min read</span>
                        <Star className="w-4 h-4 ml-2 text-yellow-400 fill-current" />
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Deutsch.vn</p>
                    <h4 className="font-bold">The German Case System: A Beginner's Guide</h4>
                    <p className="text-sm text-muted-foreground">Navigate Nominative, Accusative, Dative, and Genitive cases with ease.</p>
                     <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                        <span>Aug 21</span>
                        <span>·</span>
                        <span>10 min read</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}
