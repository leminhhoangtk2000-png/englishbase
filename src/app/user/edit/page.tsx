"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Niveau = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

const niveauOptions = [
  { value: 'A1', label: 'A1 - Anfänger (Người mới bắt đầu)' },
  { value: 'A2', label: 'A2 - Grundlegende Kenntnisse (Kiến thức cơ bản)' },
  { value: 'B1', label: 'B1 - Fortgeschrittene Anfänger (Trung cấp thấp)' },
  { value: 'B2', label: 'B2 - Selbständige Sprachverwendung (Trung cấp cao)' },
  { value: 'C1', label: 'C1 - Fachkundige Sprachkenntnisse (Cao cấp)' },
  { value: 'C2', label: 'C2 - Annähernd muttersprachliche Kenntnisse (Thành thạo)' },
];

export default function EditProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    url: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    threads: "",
    niveau: "A1" as Niveau,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load profile data from API
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const response = await fetch('/api/profile');
          if (response.ok) {
            const data = await response.json();
            const profile = data.user;
            
            setFormData({
              name: profile.name || "",
              bio: profile.bio || "",
              url: profile.url || "",
              facebook: profile.facebook || "",
              instagram: profile.instagram || "",
              tiktok: profile.tiktok || "",
              threads: profile.threads || "",
              niveau: (profile.niveau as Niveau) || "A1",
            });
            
            // Set avatar preview if exists
            if (profile.avatar) {
              setAvatarPreview(profile.avatar);
            }
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
    };
    
    loadProfile();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return null;
    
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    try {
      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.avatarUrl;
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
    
    return null;
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Upload avatar if there's a new file
      let avatarUrl = null;
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...(avatarUrl && { avatar: avatarUrl }),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      console.log('Profile updated:', result);
      
      // Show success message (you can add a toast here)
      alert('Hồ sơ đã được cập nhật thành công!');
      
      // Redirect back to user page
      router.push("/user");
    } catch (error) {
      console.error("Error saving profile:", error);
      // You could add toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hồ sơ công khai</CardTitle>
        <CardDescription>
          Thông tin này sẽ được hiển thị công khai.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={avatarPreview || user.avatar || "https://placehold.co/80x80.png"} />
            <AvatarFallback>{user.name?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <div>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <Button 
                size="sm" 
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                Thay đổi ảnh đại diện
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive hover:text-destructive"
              onClick={() => {
                setAvatarFile(null);
                setAvatarPreview("");
              }}
            >
              Xóa
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Tên</Label>
          <Input 
            id="name" 
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="niveau">Trình độ tiếng Đức hiện tại</Label>
          <Select 
            value={formData.niveau} 
            onValueChange={(value) => handleInputChange('niveau', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trình độ của bạn" />
            </SelectTrigger>
            <SelectContent>
              {niveauOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Giới thiệu</Label>
          <Textarea
            id="bio"
            placeholder="Hãy giới thiệu đôi chút về bạn..."
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input 
            id="url" 
            placeholder="https://example.com" 
            value={formData.url}
            onChange={(e) => handleInputChange('url', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook</Label>
          <Input 
            id="facebook" 
            placeholder="facebook.com/username" 
            value={formData.facebook}
            onChange={(e) => handleInputChange('facebook', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input 
            id="instagram" 
            placeholder="instagram.com/username" 
            value={formData.instagram}
            onChange={(e) => handleInputChange('instagram', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tiktok">TikTok</Label>
          <Input 
            id="tiktok" 
            placeholder="@username" 
            value={formData.tiktok}
            onChange={(e) => handleInputChange('tiktok', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="threads">Threads</Label>
          <Input 
            id="threads" 
            placeholder="@username" 
            value={formData.threads}
            onChange={(e) => handleInputChange('threads', e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          Hủy
        </Button>
      </CardFooter>
    </Card>
  );
}
