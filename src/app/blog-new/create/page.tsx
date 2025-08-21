"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [content, setContent] = React.useState(
    "Viết nội dung của bạn ở đây bằng **Markdown**!\n\n## Đây là tiêu đề H2\n\nBạn có thể thêm ảnh:\n\n![Ảnh minh họa](https://placehold.co/600x400.png)\n\n- Danh sách 1\n- Danh sách 2"
  );
  const [showPreview, setShowPreview] = React.useState(false);


  const handlePublish = () => {
    // Logic publish (sẽ được phát triển sau)
    alert("Bài viết đã được xuất bản! (Demo)");
    router.push("/blog-new");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {showPreview ? (
        // Preview Mode
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold font-headline">Xem trước bài viết</h1>
            <Button variant="outline" onClick={() => setShowPreview(false)}>Quay lại soạn thảo</Button>
          </div>
          <div className="border rounded-lg p-6 bg-card min-h-[600px]">
            <div className="prose prose-stone dark:prose-invert max-w-none prose-p:leading-7 prose-h1:font-headline prose-h1:text-4xl prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-2xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1">
              <h1>{title || "Tiêu đề sẽ hiển thị ở đây"}</h1>
              <p className="lead text-muted-foreground">{description || "Mô tả ngắn sẽ hiển thị ở đây."}</p>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
           <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>Quay lại soạn thảo</Button>
            <Button onClick={handlePublish}>Xuất bản</Button>
          </div>
        </div>
      ) : (
        // Editor Mode
        <div className="space-y-6">
           <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold font-headline">Trình soạn thảo</h1>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPreview(true)}>Xem trước</Button>
                <Button onClick={handlePublish}>Xuất bản</Button>
            </div>
          </div>
          <div>
            <Input
              type="text"
              placeholder="Tiêu đề bài viết..."
              className="text-2xl font-bold h-auto p-2 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 !text-foreground bg-card"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Textarea
              placeholder="Mô tả ngắn..."
              className="text-lg h-auto p-2 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none bg-card"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <Textarea
              placeholder="Viết nội dung của bạn ở đây bằng Markdown..."
              className="min-h-[500px] text-base p-4 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-y bg-card font-mono"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
