import { exercisesConfig } from "@/config/exercises";
import { type NavItemWithComponent } from "@/types";
import fs from 'fs';
import path from 'path';

export async function getDocFromParams(slugs: string[]) {
  const slug = slugs?.join("/") || "introduction";
  
  // Check if this is an MDX file request (e.g., /exercises/a1/einkaufen-teil-1)
  if (slugs.length >= 2) {
    const level = slugs[0]; // a1, a2, b1, b2
    const exerciseName = slugs[1];
    
    // Check if this is a valid level
    if (['a1', 'a2', 'b1', 'b2'].includes(level)) {
      try {
        const exercisePath = path.join(process.cwd(), 'src/content/exercises', level, `${exerciseName}.mdx`);
        
        if (fs.existsSync(exercisePath)) {
          // Dynamically import the MDX component
          const mdxComponent = await import(`@/content/exercises/${level}/${exerciseName}.mdx`);
          
          return {
            title: exerciseName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: `Bài tập ${level.toUpperCase()}`,
            href: `/exercises/${slug}`,
            component: mdxComponent.default,
            level: level,
            category: 'exercise'
          };
        }
      } catch (error) {
        console.error(`Error loading MDX file: ${error}`);
        return undefined;
      }
    }
  }
  
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
