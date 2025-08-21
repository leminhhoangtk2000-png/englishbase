import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GitCommit, GitMerge, Lock, MapPin, Smile, Users, Star, Book, GitBranch, BookMarked } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

const ContributionGraph = () => {
  // Dummy data representing contribution levels (0-4)
  const days = Array.from({ length: 365 }, (_, dayIndex) => {
    const month = Math.floor(dayIndex / 30);
    let level = 0;
    if (month > 1 && Math.random() > 0.4) {
      level = Math.floor(Math.random() * 4) + 1;
    }
    return level;
  });

  const contributionColors = [
    "bg-muted/30", // level 0
    "bg-green-800", // level 1
    "bg-green-700", // level 2
    "bg-green-600", // level 3
    "bg-green-500", // level 4
  ];
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="p-4 border rounded-md">
       <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm">202 contributions in 2025</h3>
        <Button variant="outline" size="sm" className="text-xs h-8">Contribution settings</Button>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex flex-col">
           {/* Month Labels */}
          <div className="flex gap-[13px] text-xs text-muted-foreground ml-7 mb-1">
              {months.map((month) => (
                <div key={month} className="w-[53px] text-left">
                  {month}
                </div>
              ))}
          </div>
          <div className="flex gap-2">
              {/* Day Labels */}
              <div className="flex flex-col justify-between text-xs text-muted-foreground self-stretch pt-px pb-px">
                  <span>Mon</span>
                  <span className="invisible md:visible">Wed</span>
                  <span>Fri</span>
              </div>
              {/* Grid */}
              <div className="grid grid-flow-col grid-rows-7 gap-1">
                  {days.map((level, index) => (
                      <div
                          key={index}
                          className={`w-2.5 h-2.5 rounded-sm ${contributionColors[level]}`}
                          title={`Contribution level ${level} on day ${index + 1}`}
                      />
                  ))}
              </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
        <Link href="#" className="hover:text-primary">Learn how we count contributions</Link>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {contributionColors.map((color, index) => (
            <div key={index} className={`w-2.5 h-2.5 rounded-sm ${color}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ icon, children, isLast = false }: { icon: React.ReactNode, children: React.ReactNode, isLast?: boolean }) => (
    <div className="relative flex items-start gap-6">
        <div className="flex flex-col items-center">
            <div className="bg-background border rounded-full h-8 w-8 flex items-center justify-center z-10">
                {icon}
            </div>
            {!isLast && <div className="w-px h-full bg-border -mt-1" />}
        </div>
        <div className="pt-1.5 pb-8 w-full">{children}</div>
    </div>
);


export default function UserPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Left Sidebar */}
        <div className="md:col-span-1">
          <Avatar className="w-full h-auto max-w-[256px] aspect-square rounded-full border-4 border-card mb-4">
            <AvatarImage src="https://placehold.co/256x256.png" data-ai-hint="man portrait" />
            <AvatarFallback>KV</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">Khoa Vo</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-4">khoavo261 · he/him</p>
          <Button variant="outline" className="w-full mb-4">Edit profile</Button>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#" className="flex items-center gap-1 hover:text-primary">
              <Users className="w-4 h-4" />
              <span className="font-semibold text-foreground">0</span> followers
            </Link>
            <span>·</span>
            <Link href="#" className="hover:text-primary">
              <span className="font-semibold text-foreground">2</span> following
            </Link>
          </div>
        </div>

        {/* Right Content */}
        <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Popular repositories</h2>
                <Link href="#" className="text-sm text-primary hover:underline">Customize your pins</Link>
            </div>
            <Card className="text-center py-8 mb-8">
                <p>You don&apos;t have any public repositories yet.</p>
            </Card>

            <ContributionGraph />

            <h2 className="text-lg font-semibold mt-8 mb-4">Contribution activity</h2>
            <div className="border-t">
                <div className="text-center text-sm py-3 border-b">
                    August 2025
                </div>

                <TimelineItem icon={<GitMerge className="w-4 h-4" />}>
                    <div className="flex justify-between items-center text-sm mb-2">
                        <h3 className="font-semibold">Created 49 commits in 2 repositories</h3>
                        <GitCommit className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <ul className="space-y-1 text-sm">
                        <li className="flex justify-between items-center">
                            <Link href="#" className="text-primary hover:underline truncate">khoavo261/Bisflow <span className="text-muted-foreground">25 commits</span></Link>
                            <div className="w-24 h-2 bg-green-600 rounded-full" />
                        </li>
                        <li className="flex justify-between items-center">
                            <Link href="#" className="text-primary hover:underline truncate">khoavo261/deutschhub <span className="text-muted-foreground">24 commits</span></Link>
                            <div className="w-24 h-2 bg-green-600 rounded-full" />
                        </li>
                    </ul>
                </TimelineItem>

                <TimelineItem icon={<BookMarked className="w-4 h-4" />}>
                     <div className="flex justify-between items-center text-sm mb-2 text-muted-foreground">
                        <h3 className="font-normal">Created their first repository</h3>
                        <span>Aug 4</span>
                    </div>
                    <Card className="p-6 text-center bg-card/50">
                        <Image src="https://placehold.co/400x200.png" data-ai-hint="space illustration" width={400} height={200} className="mx-auto mb-4 rounded-md" alt="First repository illustration"/>
                        <p className="font-semibold text-green-400">First repository</p>
                        <h4 className="font-semibold text-lg"><Link href="#" className="text-primary hover:underline">deutschhub</Link> <span className="text-xs border rounded-full px-2 py-0.5 text-muted-foreground">Private</span></h4>
                        <p className="text-xs text-muted-foreground mt-2">Only people who can see khoavo261/deutschhub can see this contribution</p>
                    </Card>
                </TimelineItem>

                <TimelineItem icon={<GitBranch className="w-4 h-4" />} isLast>
                    <div className="flex justify-between items-center text-sm mb-2">
                        <h3 className="font-semibold">Created 3 other repositories</h3>
                        <GitCommit className="w-4 h-4 text-muted-foreground" />
                    </div>
                     <ul className="space-y-2 text-sm">
                        <li className="flex justify-between items-center">
                           <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                <Link href="#" className="text-primary hover:underline">khoavo261/deutsch-vn2</Link>
                           </div>
                           <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="w-3 h-3 rounded-full bg-blue-400" />
                                <span>TypeScript</span>
                                <span>Aug 20</span>
                           </div>
                        </li>
                        <li className="flex justify-between items-center">
                           <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                <Link href="#" className="text-primary hover:underline">khoavo261/Bisflow</Link>
                           </div>
                           <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="w-3 h-3 rounded-full bg-blue-400" />
                                <span>TypeScript</span>
                                <span>Aug 13</span>
                           </div>
                        </li>
                        <li className="flex justify-between items-center">
                           <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                <Link href="#" className="text-primary hover:underline">khoavo261/DeutscheEcke</Link>
                           </div>
                           <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="w-3 h-3 rounded-full bg-blue-400" />
                                <span>TypeScript</span>
                                <span>Aug 12</span>
                           </div>
                        </li>
                    </ul>
                </TimelineItem>

            </div>
        </div>
      </div>
    </div>
  );
}
