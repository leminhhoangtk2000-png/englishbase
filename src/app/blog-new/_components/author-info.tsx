"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Hand, MessageCircle } from "lucide-react";
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
                         <Hand className="w-5 h-5" />
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
                    <Hand className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Hand className="w-5 h-5" />
                </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Hand className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Hand className="w-5 h-5" />
                </Button>
            </div>
        </div>
    )
}
