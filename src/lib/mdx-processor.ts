import { ExerciseTable } from '@/components/exercises/exercise-table';
import { ExerciseAuthor } from '@/components/exercises/exercise-author';

/**
 * Parse MDX content and extract ExerciseTable components
 */
export function parseMDXComponents(content: string) {
  const components: any[] = [];
  
  // Remove imports
  let processedContent = content.replace(/import\s+{[^}]+}\s+from\s+["'][^"']+["'];?\n?/g, '');
  
  console.log('[MDX Debug] Processing content:', processedContent.slice(0, 500));
  
  // Improved regex to handle multiline ExerciseTable components
  const exerciseTableRegex = /<ExerciseTable\s+([^>]*?)exercises=\{\[([^\]]+)\]\}([^>]*?)\s*\/>/g;
  let match;
  
  while ((match = exerciseTableRegex.exec(processedContent)) !== null) {
    const [fullMatch, beforeExercises, exercisesStr, afterExercises] = match;
    
    console.log('[MDX Debug] Found ExerciseTable match:', { beforeExercises, exercisesStr });
    
    try {
      // Parse the props
      const titleMatch = beforeExercises.match(/title="([^"]+)"/);
      const subtitleMatch = beforeExercises.match(/subtitle="([^"]+)"/);
      
      // Parse exercises array
      const exercises = parseExercisesArray(exercisesStr);
      
      console.log('[MDX Debug] Parsed exercises:', exercises);
      
      if (exercises.length > 0) {
        components.push({
          type: 'ExerciseTable',
          props: {
            title: titleMatch ? titleMatch[1] : 'Exercise',
            subtitle: subtitleMatch ? subtitleMatch[1] : undefined,
            exercises: exercises
          }
        });
        
        // Replace the component in content with a placeholder
        processedContent = processedContent.replace(fullMatch, `\n\n[EXERCISE_COMPONENT_${components.length - 1}]\n\n`);
      }
    } catch (error) {
      console.error('Error parsing ExerciseTable:', error);
    }
  }
  
  console.log('[MDX Debug] Found components:', components.length);
  
  return {
    content: processedContent,
    components
  };
}

/**
 * Parse exercises array from string
 */
function parseExercisesArray(exercisesStr: string): any[] {
  try {
    // Clean up the string - remove extra whitespace and handle multiline
    const cleanStr = exercisesStr
      .replace(/\s+/g, ' ')
      .trim();
    
    // Try to match individual exercise objects
    const exerciseRegex = /\{\s*id:\s*(\d+),\s*german:\s*"([^"]+)",\s*correctAnswer:\s*"([^"]+)"\s*\}/g;
    const exercises = [];
    let exerciseMatch;
    
    while ((exerciseMatch = exerciseRegex.exec(cleanStr)) !== null) {
      exercises.push({
        id: parseInt(exerciseMatch[1]),
        german: exerciseMatch[2],
        correctAnswer: exerciseMatch[3]
      });
    }
    
    return exercises;
  } catch (error) {
    console.error('Error parsing exercises array:', error);
    return [];
  }
}

/**
 * Render components to React elements
 */
export function renderMDXComponents(components: any[]) {
  return components.map((component, index) => {
    switch (component.type) {
      case 'ExerciseTable':
        return {
          key: `exercise-${index}`,
          element: ExerciseTable,
          props: component.props
        };
      default:
        return null;
    }
  }).filter(Boolean);
}
