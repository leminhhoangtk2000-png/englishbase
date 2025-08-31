import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

const savedPosts = [
  {
    author: "Sejalbaranwal",
    title: "I Use These 5 ChatGPT Prompts Daily - You'll Wish You Knew These Sooner",
    image: "https://placehold.co/112x112.png",
    data_ai_hint: "ai prompts",
  },
  {
    author: "Anthony Lam",
    title: "I Tried 19 Side Hustles. Here's What Actually Made Me Money (And What Sucked)",
    image: "https://placehold.co/112x112.png",
    data_ai_hint: "woman laptop",
  },
];

export function SavedPosts() {
    return (
        <Card>
            <div className="p-6">
                <h2 className="text-2xl font-bold font-headline">Bài viết đã lưu</h2>
                <p className="text-muted-foreground mt-1">Những bài viết bạn đã lưu để đọc sau.</p>
            </div>
            <div className="border-t">
                <div className="space-y-6 p-6">
                    {savedPosts.map((post, index) => (
                        <div key={index}>
                            <div className="flex justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center text-sm mb-2">
                                        <Avatar className="h-6 w-6 mr-2">
                                            <AvatarImage src={`https://placehold.co/24x24.png`} alt={post.author} />
                                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-semibold">{post.author}</span>
                                    </div>
                                    <h3 className="font-bold font-headline text-lg">
                                        <Link href="/blog-new/first-post" className="hover:underline">
                                            {post.title}
                                        </Link>
                                    </h3>
                                </div>
                                <div className="flex-shrink-0">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        width={112}
                                        height={112}
                                        data-ai-hint={post.data_ai_hint}
                                        className="object-cover rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end mt-2">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                                    <X className="w-4 h-4 mr-1" />
                                    Bỏ lưu
                                </Button>
                            </div>
                            {index < savedPosts.length - 1 && <Separator className="mt-6" />}
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
