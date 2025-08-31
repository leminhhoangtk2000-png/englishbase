import { exercisesConfig } from "@/config/exercises";
import { type NavItemWithComponent } from "@/types";
import fs from 'fs';
import path from 'path';

export async function getDocFromParams(slugs: string[]) {
  const slug = slugs?.join("/") || "introduction";
  
  // For now, let's handle exercise routes but return to config-based system
  // This will be updated once we have actual MDX components registered
  
  // Fallback to config-based docs
  const doc = exercisesConfig.items
    .flatMap((item) => item.items ?? [])
    .find((doc) => doc.href === `/exercises/${slug}`);

  return doc as NavItemWithComponent | undefined;
}

export async function getExercisesByLevel(level: string) {
  try {
    const exercisesPath = path.join(process.cwd(), 'src/content/exercises', level);
    
    if (!fs.existsSync(exercisesPath)) {
      return [];
    }
    
    const files = fs.readdirSync(exercisesPath).filter(file => file.endsWith('.mdx'));
    
    const exercises = await Promise.all(
      files.map(async (file) => {
        const exerciseName = file.replace('.mdx', '');
        const exercisePath = path.join(exercisesPath, file);
        
        // Read the frontmatter to get title and description
        const content = fs.readFileSync(exercisePath, 'utf-8');
        const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
        
        let title = exerciseName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        let description = `Bài tập ${level.toUpperCase()}`;
        let tags: string[] = [];
        
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          const titleMatch = frontmatter.match(/title:\s*(.+)/);
          const descMatch = frontmatter.match(/description:\s*(.+)/);
          const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
          
          if (titleMatch) title = titleMatch[1].replace(/['"]/g, '');
          if (descMatch) description = descMatch[1].replace(/['"]/g, '');
          if (tagsMatch) {
            tags = tagsMatch[1].split(',').map(tag => tag.trim().replace(/['"]/g, ''));
          }
        }
        
        return {
          title,
          description,
          href: `/exercises/${level}/${exerciseName}`,
          level: level.toUpperCase(),
          tags,
          slug: exerciseName
        };
      })
    );
    
    return exercises;
  } catch (error) {
    console.error(`Error loading exercises for level ${level}:`, error);
    return [];
  }
}
