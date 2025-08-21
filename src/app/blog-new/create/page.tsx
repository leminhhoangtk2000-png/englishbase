"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const router = useRouter();

  const handlePublish = () => {
    // Here you would typically handle form submission,
    // like sending the data to a server.
    // For now, we'll just navigate back to the blog page.
    alert("Blog post published! (Not really, this is a demo)");
    router.push("/blog-new");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold font-headline mb-8">Viết bài mới</h1>

        <div className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Tiêu đề bài viết..."
              className="text-2xl font-bold h-auto p-2 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 !text-foreground"
            />
          </div>
          <div>
            <Textarea
              placeholder="Mô tả ngắn..."
              className="text-lg h-auto p-2 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
              rows={2}
            />
          </div>
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <Textarea
              placeholder="Viết nội dung của bạn ở đây..."
              className="min-h-[400px] text-base p-2 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-y"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handlePublish}>Xuất bản</Button>
        </div>
      </div>
    </div>
  );
}
