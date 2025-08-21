"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bookmark, MessageCircle, Mic, MoreHorizontal, PlayCircle } from "lucide-react";
import React from "react";

type AuthorDetails = {
    name: string;
    publication: string;
    avatar: string;
    bio: string;
    claps: number;
    comments: number;
}

export function AuthorInfo({ author }: { author: AuthorDetails }) {
    const [claps, setClaps] = React.useState(author.claps);

    const handleClap = () => {
        setClaps(claps + 1);
    };

    return (
        <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-b py-3">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClap}>
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.9l.7-2.94c.04-.18.23-.29.4-.25l.26.05c.17.03.29.2.25.38l-.7 2.93-1.9.83zm-3.84 0l-1.9-.83.7-2.94c.04-.18.23-.29.4-.25l.26.05c.17.03.29.2.25.38l-.7 2.93zM20.08 11c.45-.42.72-1.03.72-1.69 0-1.33-1.08-2.41-2.42-2.41-1.33 0-2.41 1.08-2.41 2.41 0 .31.06.6.17.86l-3.2 3.2-3.2-3.2c.1-.26.17-.55.17-.86 0-1.33-1.08-2.41-2.42-2.41-1.33 0-2.41 1.08-2.41 2.41 0 .66.27 1.27.72 1.69C2.18 12.55 1 15.89 1 19.52V20h1.52c0-3.52 2.92-6.38 6.5-6.38s6.5 2.86 6.5 6.38H23v-.48c0-3.63-1.18-6.97-3.92-8.52z" fill="currentColor"></path></svg>
                    </Button>
                    <span>{claps}</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageCircle className="w-5 h-5" />
                    </Button>
                     <span>{author.comments}</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bookmark className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <PlayCircle className="w-5 h-5" />
                </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Mic className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-5 h-5" />
                </Button>
            </div>
        </div>
    )
}
