import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bookmark, MessageCircle, MoreHorizontal, BarChart2 } from "lucide-react";

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

export default function BlogPage() {
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
