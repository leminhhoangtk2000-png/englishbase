"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, MessageCircle, MoreHorizontal, BarChart2, Linkedin, Twitter, Facebook, Link as LinkIcon, Star, Hand, PlayCircle, Upload, PenSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface BlogPostPageProps {
  title?: string;
  description?: string;
  content?: React.ReactNode;
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

const allRecommendedTopics = [
  "Học ngoại ngữ",
  "Ngữ pháp & Từ vựng",
  "Kỹ năng nghe – nói – đọc – viết",
  "Công cụ & Tài liệu học tập",
  "Học bổng & Cơ hội tài chính",
  "Visa & Thủ tục hồ sơ",
  "Cuộc sống du học",
  "Làm thêm & Quản lý tài chính",
  "Các quốc gia & Hệ thống giáo dục",
  "Định hướng nghề nghiệp & Cơ hội sau du học",
  "Du lịch & Khám phá",
  "Ẩm thực & Nấu ăn",
  "Sách & Văn hóa đọc",
  "Phim ảnh & Giải trí",
  "Âm nhạc & Podcast",
  "Thể thao & Sức khỏe",
  "Công nghệ & Ứng dụng hữu ích",
  "Kỹ năng sống & Phát triển bản thân",
  "Tài chính cá nhân & Quản lý tiền bạc",
  "Thời trang & Phong cách sống",
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
  const [showAllTopics, setShowAllTopics] = React.useState(false);
  const recommendedTopics = showAllTopics ? allRecommendedTopics : allRecommendedTopics.slice(0, 7);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="border-b flex justify-between items-center">
        <div className="flex items-center space-x-6 text-sm text-muted-foreground overflow-x-auto pb-3">
          <Link href="#" className="text-foreground font-semibold">+</Link>
          <Link href="#" className="text-foreground font-semibold">A1 Niveau</Link>
          <Link href="#" className="hover:text-foreground">A2 Niveau</Link>
          <Link href="#" className="hover:text-foreground">B1 Niveau</Link>
          <Link href="#" className="hover:text-foreground">B2 Niveau</Link>
          <Link href="#" className="hover:text-foreground">C1 Niveau</Link>
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
          <h3 className="font-semibold mb-4">Lựa chọn của biên tập</h3>
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
            <Link href="#" className="text-sm text-primary hover:underline">Xem toàn bộ danh sách</Link>
          </div>

          <Separator className="my-8" />

          <h3 className="font-semibold mb-4">Chủ đề đề xuất</h3>
          <div className="flex flex-wrap gap-2">
            {recommendedTopics.map((topic) => (
              <Badge key={topic} variant="secondary" className="px-3 py-1 rounded-full cursor-pointer hover:bg-muted">{topic}</Badge>
            ))}
          </div>
          <button onClick={() => setShowAllTopics(!showAllTopics)} className="text-sm text-primary hover:underline mt-4 inline-block">
            {showAllTopics ? "Ẩn bớt" : "Xem thêm"}
          </button>

          <Separator className="my-8" />

          <h3 className="font-semibold mb-4">Gợi ý theo dõi</h3>
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
                <Button variant="outline" size="sm" className="rounded-full">Theo dõi</Button>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

const authorDetails = {
  name: "The Useful Tech",
  publication: "The Startup",
  avatar: "https://placehold.co/48x48.png",
  bio: "Writer and illustrator. Follow my newsletter: https://thestartup.info",
  claps: 3500,
  comments: 117
};

type CommentData = {
    author: string;
    avatar: string;
    text: string;
    claps: number;
    date: string;
    replies?: CommentData[];
};

const commentsData: CommentData[] = [
    {
        author: "Carl Cort",
        avatar: "https://placehold.co/32x32.png",
        text: "I used to be a doom-scroller and these apps really helped me to break the habit. Thanks for sharing!",
        claps: 2,
        date: "2 mo ago",
        replies: [
            {
                author: "J.P. Lamborn",
                avatar: "https://placehold.co/32x32.png",
                text: "Great list! I'd also add 'Readwise' to the list. It's a great app for saving and revisiting highlights from articles and books.",
                claps: 1,
                date: "1 mo ago"
            }
        ]
    }
];

function Comment({ comment, level = 0 }: { comment: CommentData, level?: number }) {
    const [repliesVisible, setRepliesVisible] = React.useState(false);
    const [isReplying, setIsReplying] = React.useState(false);
    const hasReplies = comment.replies && comment.replies.length > 0;

    const toggleReplies = () => {
        if (hasReplies) {
            setRepliesVisible(!repliesVisible);
        }
    }
    
    const handleReplyClick = () => {
        setIsReplying(!isReplying);
    }

    return (
        <div className={level > 0 ? "ml-8" : ""}>
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
                    <Hand className="w-5 h-5" />
                    <span>{comment.claps}</span>
                </div>
                {hasReplies && (
                    <div onClick={toggleReplies} className="flex items-center gap-2 cursor-pointer hover:text-foreground">
                        <MessageCircle className="w-4 h-4" />
                        <span>{comment.replies?.length}</span>
                    </div>
                )}
                <span onClick={handleReplyClick} className="cursor-pointer hover:text-foreground">Reply</span>
            </div>
            
            {isReplying && (
                <div className="mt-4">
                    <Textarea placeholder={`Replying to ${comment.author}...`} className="mb-2" />
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsReplying(false)}>Cancel</Button>
                        <Button size="sm">Respond</Button>
                    </div>
                </div>
            )}

            {hasReplies && repliesVisible && (
                <div className="mt-4 space-y-6 border-l-2 border-border pl-4">
                    {comment.replies?.map((reply, index) => (
                        <Comment key={index} comment={reply} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Custom SVG component for the clapping icon
const ClapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="inline-block">
    <path d="M14.5 19.5V10.75C14.5 10.1977 14.0523 9.75 13.5 9.75H12.75C12.1977 9.75 11.75 10.1977 11.75 10.75V19.5H14.5Z" stroke="currentColor" strokeWidth="1.5"></path>
    <path d="M9.5 19.5V11.25C9.5 10.6977 9.05228 10.25 8.5 10.25H7.75C7.19772 10.25 6.75 10.6977 6.75 11.25V19.5H9.5Z" stroke="currentColor" strokeWidth="1.5"></path>
    <path d="M4.5 19.5V12.75C4.5 12.1977 4.05228 11.75 3.5 11.75H2.75C2.19772 11.75 1.75 12.1977 1.75 12.75V19.5H4.5Z" stroke="currentColor" strokeWidth="1.5"></path>
    <path d="M18.5 10.75C18.5 9.7835 18.1181 8.85537 17.4393 8.17655C16.7605 7.49773 15.8324 7.11578 14.866 7.11578H12.634C11.6676 7.11578 10.7395 7.49773 10.0607 8.17655C9.38186 8.85537 9 9.7835 9 10.75C9 11.4554 9.38928 12.1006 9.99264 12.4437C11.6111 13.3402 14.866 14.5323 14.866 17.3842V19.5H19.25C19.8023 19.5 20.25 19.0523 20.25 18.5V12.75C20.25 11.6196 19.5112 10.75 18.5 10.75Z" stroke="currentColor" strokeWidth="1.5"></path>
  </svg>
);

const SupportIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="inline-block">
        <path d="M15.63 13.922a.615.615 0 01.485.485c.04.13.06.264.06.402v1.581a.69.69 0 01-.69.69H7.69a.69.69 0 01-.69-.69v-1.58c0-.139.02-.273.06-.403a.615.615 0 01.485-.485c.13-.04.264-.06.402-.06h7.586c.138 0 .272.02.402.06zM9.5 9.21a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM17 9.21a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" fill="currentColor"></path>
        <path fillRule="evenodd" clipRule="evenodd" d="M12.21 2.322a.69.69 0 01.58 0 9.888 9.888 0 018.006 8.006.69.69 0 010 .58 9.888 9.888 0 01-8.006 8.006.69.69 0 01-.58 0 9.888 9.888 0 01-8.006-8.006.69.69 0 010-.58 9.888 9.888 0 018.006-8.006zM3.56 11.838a8.51 8.51 0 007.068 7.068.69.69 0 00.372 0 8.51 8.51 0 007.067-7.068.69.69 0 000-.372A8.51 8.51 0 0011 4.398a.69.69 0 00-.372 0A8.51 8.51 0 003.56 11.47a.69.69 0 000 .372z" fill="currentColor"></path>
    </svg>
);


function AuthorInfo() {
  const { name, claps, comments } = authorDetails;

  return (
    <div className="space-y-8 my-12">
      <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-b py-3">
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                       <ClapIcon />
                  </Button>
                  <span>{(claps / 1000).toFixed(1)}K</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageCircle className="w-5 h-5" />
                  </Button>
                   <span>{comments}</span>
              </div>
          </div>
          <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bookmark className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Upload className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-5 h-5" />
              </Button>
          </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 rounded-full border">
            <AvatarImage src="https://placehold.co/64x64.png" alt="Mac O'Clock" />
            <AvatarFallback>MO</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">Published in</p>
            <h3 className="text-lg font-bold">Mac O'Clock</h3>
            <p className="text-sm text-muted-foreground mt-1">72K followers · Last published 9 hours ago</p>
          </div>
        </div>
        <Button variant="outline" className="rounded-full shrink-0">Follow</Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 rounded-full border">
            <AvatarImage src={authorDetails.avatar} alt={authorDetails.name} />
            <AvatarFallback>{authorDetails.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">Written by</p>
            <h3 className="text-lg font-bold">{authorDetails.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">69K followers · 41 following</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-full">Follow</Button>
            <Button variant="outline" size="icon" className="rounded-full">
                <SupportIcon />
            </Button>
        </div>
      </div>

    </div>
  )
}

function DocPageContent({ title, description, content }: { title: string, description?: string, content: React.ReactNode }) {
  const [claps, setClaps] = React.useState(authorDetails.claps);
  const handleClap = () => setClaps(claps + 1);

  return (
    <main className="relative py-6 lg:py-8">
      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="space-y-4 mb-8">
            <Badge variant="outline" className="rounded-full py-1 px-3 border-muted-foreground/50">
                <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                Member-only story
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl font-headline">
              <span className="box-decoration-clone bg-green-200/50 dark:bg-green-800/50 px-2 leading-[1.5]">
                {title}
              </span>
            </h1>

            {description && (
                <p className="text-xl text-muted-foreground">{description}</p>
            )}
        </div>

        <div className="flex items-center gap-3 my-6">
            <Avatar className="h-12 w-12 rounded-full border-2 border-foreground">
                <AvatarImage src={authorDetails.avatar} alt={authorDetails.name} />
                <AvatarFallback>{authorDetails.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-sm">
                <span className="font-semibold">{authorDetails.name}</span>
                <Button variant="outline" size="sm" className="rounded-full h-8 mt-1 sm:mt-0">Follow</Button>
            </div>
            <div className="text-sm text-muted-foreground ml-auto sm:ml-0">
                10 min read <span className="mx-1">·</span> Apr 25, 2025
            </div>
        </div>
        
        <Separator className="my-4" />

        <div className="flex items-center justify-between text-sm text-muted-foreground py-2">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClap}>
                         <ClapIcon />
                    </Button>
                    <span>{(claps / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageCircle className="w-5 h-5" />
                    </Button>
                     <span>{authorDetails.comments}</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bookmark className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <PlayCircle className="w-5 h-5" />
                </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Upload className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-5 h-5" />
                </Button>
            </div>
        </div>
        
        <Separator className="mb-8" />

        <div className="my-8">
            <Image 
                src="https://placehold.co/800x500.png" 
                alt={title}
                width={800}
                height={500}
                data-ai-hint="colorful illustration"
                className="w-full object-cover rounded-md"
            />
        </div>

        <div className="prose prose-stone dark:prose-invert max-w-none mx-auto prose-xl font-serif prose-p:leading-8 prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-3xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1">
          {content}
        </div>
        
        <AuthorInfo />
        
        <Separator className="my-12" />

        <div className="space-y-8">
            <h2 className="text-2xl font-bold font-headline">Responses ({commentsData.length})</h2>

            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="Khoavo Private"/>
                        <AvatarFallback>KP</AvatarFallback>
                    </Avatar>
                    <div className="w-full">
                        <p className="font-semibold">Khoavo Private</p>
                        <Card className="mt-2">
                           <Textarea placeholder="What are your thoughts?" className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[60px]" />
                        </Card>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {commentsData.map((comment, index) => (
                    <Comment key={index} comment={comment} />
                ))}
            </div>
             <Button variant="outline" className="rounded-full">Show more responses</Button>
        </div>

        <Separator className="my-12" />

        <div>
            <h3 className="font-semibold mb-4 font-headline">More from The Startup</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                    <Image 
                        src="https://placehold.co/600x400.png"
                        alt="iOS Features"
                        width={600}
                        height={400}
                        data-ai-hint="smartphone interface"
                        className="object-cover rounded-md w-full"
                    />
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                            <Avatar className="h-5 w-5"><AvatarImage src="https://placehold.co/20x20.png" /></Avatar>
                            <span>The Startup</span>
                        </div>
                        <h4 className="font-bold font-headline">12 New iOS Features That Will Change the Way You Use Your iPhone</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                            <span>May 12</span>
                            <span className="text-xl leading-none">·</span>
                            <span>5 min read</span>
                            <Star className="w-4 h-4 ml-auto text-yellow-400 fill-current" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                     <Image 
                        src="https://placehold.co/600x400.png"
                        alt="German Case System"
                        width={600}
                        height={400}
                        data-ai-hint="german flag book"
                        className="object-cover rounded-md w-full"
                    />
                    <div className="space-y-2">
                         <div className="flex items-center gap-2 text-xs">
                            <Avatar className="h-5 w-5"><AvatarImage src="https://placehold.co/20x20.png" /></Avatar>
                            <span>Deutsch.vn</span>
                        </div>
                        <h4 className="font-bold font-headline">The German Case System: A Beginner's Guide</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                            <span>Aug 21</span>
                             <span className="text-xl leading-none">·</span>
                            <span>10 min read</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}

export function BlogPostPage({ title, description, content }: BlogPostPageProps) {
  if (!title || !content) {
    return <BlogListPage />;
  }
  return <DocPageContent title={title} description={description} content={content} />;
}
