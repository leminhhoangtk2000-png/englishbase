'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Crown, Quote, BookmarkCheck, Pencil, Trash2 } from "lucide-react";
import Link from 'next/link';
import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SavedVocabularyCard } from "@/components/saved-vocabulary-card";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

// Import components
import { ContributionGraph } from "./_components/ContributionGraph";
import { UserActivity } from "./_components/UserActivity";
import { PlatformReview } from "./_components/PlatformReview";
import { LearningGoal } from "./_components/LearningGoal";
import { SavedPosts } from "./_components/SavedPosts";
import { blogPosts } from "./_components/data";

export default function UserPage() {
  const router = useRouter();
  const { user } = useAuth();

  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  // Mock profile data
  const profileData = {
    name: user.name || 'User',
    username: user.username || 'user',
    avatar: user.avatar,
    bio: user.bio || 'Đang học tiếng Đức với Deutsch.vn',
    url: user.url,
    facebook: user.facebook,
    instagram: user.instagram,
    tiktok: user.tiktok,
    threads: user.threads,
  };

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Left Sidebar */}
        <div className="md:col-span-1">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="mx-auto relative">
                <Avatar className="w-20 h-20 mx-auto">
                  <AvatarImage src={profileData.avatar || ''} alt={profileData.name} />
                  <AvatarFallback>{profileData.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">{profileData.name}</h2>
                <p className="text-sm text-muted-foreground">@{profileData.username}</p>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {profileData.bio}
              </p>
              
              <div className="flex justify-center space-x-4 text-sm">
                <Link href="#" className="hover:text-primary flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold text-foreground">0</span> người theo dõi
                </Link>
                <span>·</span>
                <Link href="#" className="hover:text-primary">
                  <span className="font-semibold text-foreground">2</span> đang theo dõi
                </Link>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground max-w-full">
                {/* Website URL */}
                {profileData?.url && (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-4 h-4 flex-shrink-0">🔗</span>
                    <Link 
                      href={profileData.url} 
                      target="_blank" 
                      className="hover:text-primary truncate block"
                      title={profileData.url}
                    >
                      {profileData.url}
                    </Link>
                  </div>
                )}

                {/* Social Media Links */}
                {profileData?.facebook && (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-4 h-4 text-blue-600 flex-shrink-0">FB</span>
                    <Link 
                      href={`https://facebook.com/${profileData.facebook}`} 
                      target="_blank" 
                      className="hover:text-primary truncate block"
                      title={`facebook.com/${profileData.facebook}`}
                    >
                      facebook.com/{profileData.facebook}
                    </Link>
                  </div>
                )}

                {profileData?.instagram && (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-4 h-4 text-pink-600 flex-shrink-0">IG</span>
                    <Link 
                      href={`https://instagram.com/${profileData.instagram}`} 
                      target="_blank" 
                      className="hover:text-primary truncate block"
                      title={`instagram.com/${profileData.instagram}`}
                    >
                      instagram.com/{profileData.instagram}
                    </Link>
                  </div>
                )}

                {profileData?.tiktok && (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-4 h-4 text-black flex-shrink-0">TT</span>
                    <Link 
                      href={`https://tiktok.com/@${profileData.tiktok}`} 
                      target="_blank" 
                      className="hover:text-primary truncate block"
                      title={`tiktok.com/@${profileData.tiktok}`}
                    >
                      tiktok.com/@{profileData.tiktok}
                    </Link>
                  </div>
                )}

                {profileData?.threads && (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-4 h-4 text-black flex-shrink-0">TH</span>
                    <Link 
                      href={`https://threads.net/@${profileData.threads}`} 
                      target="_blank" 
                      className="hover:text-primary truncate block"
                      title={`threads.net/@${profileData.threads}`}
                    >
                      threads.net/@{profileData.threads}
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <PlatformReview />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content */}
        <div className="md:col-span-3">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="write" asChild>
                <Link href="/blog-new/create">Viết cùng Deutsch.vn</Link>
              </TabsTrigger>
              <TabsTrigger value="manage-blog">Quản lý blog</TabsTrigger>
              <TabsTrigger value="saved-posts">Bài viết đã lưu</TabsTrigger>
              <TabsTrigger value="saved-vocabulary" className="flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4" />
                Từ vựng đã lưu
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="relative">
                <div className="filter blur-sm opacity-50 pointer-events-none">
                  <ContributionGraph />
                  <LearningGoal />
                  <UserActivity />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-lg p-8 text-center">
                  <Crown className="w-16 h-16 text-yellow-500 mb-4" />
                  <h3 className="text-2xl font-bold font-headline mb-2">Mở khóa tính năng Premium</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Nâng cấp tài khoản để theo dõi tiến độ học tập, đặt mục tiêu và xem lại lịch sử hoạt động của bạn.
                  </p>
                  <Button size="lg" asChild>
                    <Link href="/payment">Nâng cấp ngay</Link>
                  </Button>
                  <div className="mt-8 max-w-2xl w-full">
                    <div className="bg-secondary/50 border rounded-lg p-6 text-sm text-muted-foreground text-left relative">
                      <Quote className="absolute top-2 left-2 w-8 h-8 text-border" />
                      <div className="space-y-3 pl-4">
                        <p>
                          Hi các bạn, đây là một dự án <strong className="text-foreground">không nhằm mục đích thu lợi nhuận</strong>. Nhưng hiện tại dự án đang trong đà phát triển quá nhanh, bọn mình đã bắt đầu phải thuê server riêng, và có nhiều chi phí phát sinh khác. Vì vậy có một vài phần <strong className="text-foreground">không quá quan trọng</strong>, chỉ nhằm mục đích <strong className="text-foreground">tăng cao trải nghiệm</strong> bọn mình sẽ giới hạn lại để tiết kiệm chi phí dự án.
                        </p>
                        <p>
                          Đây là phần <strong className="text-foreground">không thật sự cần thiết cho việc học</strong>, bọn mình làm phần này vì <strong className="text-foreground">đam mê</strong> tạo ra một sản phẩm trải nghiệm tốt. Nếu các bạn không có nhu cầu đó thì <strong className="text-foreground">không cần trả phí</strong> cho phần này đâu nha.
                        </p>
                      </div>
                      <Quote className="absolute bottom-2 right-2 w-8 h-8 text-border rotate-180" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="manage-blog">
              <Card>
                <div className="p-6">
                  <h2 className="text-2xl font-bold font-headline">Quản lý bài viết</h2>
                  <p className="text-muted-foreground mt-1">Xem, chỉnh sửa hoặc xóa các bài viết của bạn.</p>
                </div>
                <div className="border-t">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60%]">Tiêu đề</TableHead>
                        <TableHead>Ngày đăng</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogPosts.map((post, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <Link href="/blog-new/first-post" className="hover:underline">
                              {post.title}
                            </Link>
                          </TableCell>
                          <TableCell>{post.date}</TableCell>
                          <TableCell>
                            <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                              {post.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm">
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="saved-posts">
              <SavedPosts />
            </TabsContent>
            
            <TabsContent value="saved-vocabulary">
              <SavedVocabularyCard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
