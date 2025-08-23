import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, PlusCircle, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tests = [
  {
    name: "Bài kiểm tra tổng hợp A1-B2",
    level: "A1 - B2",
    questionCount: 60,
  },
  {
    name: "Bài kiểm tra từ vựng A1",
    level: "A1",
    questionCount: 20,
  },
  {
    name: "Bài kiểm tra ngữ pháp A2",
    level: "A2",
    questionCount: 30,
  },
];

export default function AdminTestsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý Bài kiểm tra
          </h1>
          <p className="mt-1 text-muted-foreground">
            Thêm, sửa đổi và quản lý các bài kiểm tra trên nền tảng.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm bài kiểm tra mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài kiểm tra</CardTitle>
          <CardDescription>
            Hiện có {tests.length} bài kiểm tra trong hệ thống.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Tên bài kiểm tra</TableHead>
                  <TableHead>Trình độ</TableHead>
                  <TableHead className="hidden md:table-cell">Số câu hỏi</TableHead>
                  <TableHead>
                    <span className="sr-only">Hành động</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.name}>
                    <TableCell className="font-medium">{test.name}</TableCell>
                    <TableCell>{test.level}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {test.questionCount}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
