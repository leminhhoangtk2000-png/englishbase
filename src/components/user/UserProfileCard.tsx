'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  User, Mail, Calendar, Award, BookOpen, CheckCircle, 
  TrendingUp, Target, Clock, Star, Globe, Facebook, 
  Instagram, MessageCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  role: string;
  isPremium: boolean;
  bio: string | null;
  skillLevel: string | null;
  createdAt: string;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  threads: string | null;
  tiktok: string | null;
  stats: {
    totalExercises: number;
    completedExercises: number;
    totalVocabulary: number;
    totalReadingTime: number;
    streak: number;
    level: string;
    xp: number;
  };
}

export function UserProfileCard({ userId }: { userId?: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const url = userId ? `/api/user-profile?userId=${userId}` : '/api/user-profile';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="h-40 bg-muted" />
        <CardContent className="h-96 bg-muted/50" />
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>{error || 'Profile not found'}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const completionRate = profile.stats.totalExercises > 0
    ? (profile.stats.completedExercises / profile.stats.totalExercises) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar || undefined} alt={profile.name || 'User'} />
              <AvatarFallback>
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{profile.name || 'Anonymous User'}</h2>
                {profile.isPremium && (
                  <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500">
                    <Star className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                <Badge variant="outline">{profile.role}</Badge>
              </div>

              {profile.username && (
                <p className="text-muted-foreground">@{profile.username}</p>
              )}

              {profile.bio && (
                <p className="text-sm text-muted-foreground max-w-2xl">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(profile.createdAt).toLocaleDateString()}
                </span>
                {profile.skillLevel && (
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {profile.skillLevel}
                  </span>
                )}
              </div>

              {/* Social Links */}
              <div className="flex gap-2">
                {profile.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {profile.facebook && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.facebook} target="_blank" rel="noopener noreferrer">
                      <Facebook className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {profile.instagram && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {profile.threads && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.threads} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercises Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.stats.completedExercises}</div>
            <Progress value={completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completionRate.toFixed(1)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vocabulary</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.stats.totalVocabulary}</div>
            <p className="text-xs text-muted-foreground">Words learned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reading Time</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(profile.stats.totalReadingTime / 3600)}h
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.floor((profile.stats.totalReadingTime % 3600) / 60)} minutes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.stats.streak} days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
          <CardDescription>Track your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-semibold">{profile.stats.level}</span>
                </div>
                <Progress value={(profile.stats.xp % 1000) / 10} />
                <p className="text-xs text-muted-foreground text-right">
                  {profile.stats.xp % 1000} / 1000 XP to next level
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total XP</span>
                  <span className="font-semibold">{profile.stats.xp} XP</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Award className="h-8 w-8 text-yellow-500" />
                  <div>
                    <h4 className="font-semibold">First Steps</h4>
                    <p className="text-sm text-muted-foreground">Complete your first exercise</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg opacity-50">
                  <Award className="h-8 w-8" />
                  <div>
                    <h4 className="font-semibold">Week Warrior</h4>
                    <p className="text-sm text-muted-foreground">Maintain a 7-day streak</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <p className="text-sm text-muted-foreground">Activity timeline coming soon...</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
