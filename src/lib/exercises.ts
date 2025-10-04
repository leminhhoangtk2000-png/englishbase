import { exercisesConfig } from "@/config/exercises";
import { type NavItemWithComponent } from "@/types";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface ExerciseDoc {
  title: string;
  description: string;
  level: string;
  category: string;
  tags: string[];
  content: string;
  slug: string[];
  filePath: string;
}

export async function getDocFromParams(slugs: string[]): Promise<ExerciseDoc | undefined> {
  if (!slugs || slugs.length === 0) {
    return undefined;
  }

  // Try to find MDX file in content/exercises directory
  const exercisePath = path.join(process.cwd(), 'src/content/exercises', ...slugs);
  
  // Try both with and without .mdx extension
  const possiblePaths = [
    `${exercisePath}.mdx`,
    path.join(exercisePath, 'index.mdx'),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        return {
          title: data.title || 'Untitled',
          description: data.description || '',
          level: data.category || slugs[0]?.toUpperCase() || 'A1',
          category: data.category || slugs[0]?.toUpperCase() || 'A1',
          tags: data.tags || [],
          content,
          slug: slugs,
          filePath,
        };
      } catch (error) {
        console.error(`Error reading exercise file: ${filePath}`, error);
      }
    }
  }
  
  // Fallback to config-based docs
  const slug = slugs.join("/");
  const doc = exercisesConfig.items
    .flatMap((item) => item.items ?? [])
    .find((doc) => doc.href === `/exercises/${slug}`);

  return doc as any;
}

export async function getExercisesByLevel(level: string) {
  try {
    const exercisesPath = path.join(process.cwd(), 'src/content/exercises', level);
    
    if (!fs.existsSync(exercisesPath)) {
      return [];
    }
    
    const exercises: any[] = [];
    
    // Recursively scan subdirectories (Horen, Lesen, etc.)
    function scanDirectory(dirPath: string, relativePath: string = '') {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      
      entries.forEach(entry => {
        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          scanDirectory(
            path.join(dirPath, entry.name),
            relativePath ? `${relativePath}/${entry.name}` : entry.name
          );
        } else if (entry.name.endsWith('.mdx')) {
          const fullPath = path.join(dirPath, entry.name);
          const content = fs.readFileSync(fullPath, 'utf-8');
          const { data } = matter(content);
          
          const exerciseName = entry.name.replace('.mdx', '');
          const slug = relativePath ? `${relativePath}/${exerciseName}` : exerciseName;
          
          exercises.push({
            title: data.title || exerciseName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: data.description || `Bài tập ${level.toUpperCase()}`,
            href: `/exercises/${level}/${slug}`,
            level: level.toUpperCase(),
            tags: data.tags || [],
            category: relativePath || 'Allgemein',
            slug,
            fileName: entry.name
          });
        }
      });
    }
    
    scanDirectory(exercisesPath);
    
    return exercises;
  } catch (error) {
    console.error(`Error loading exercises for level ${level}:`, error);
    return [];
  }
}
