'use client';

import React, { useEffect, useState } from 'react';
import { ExerciseTable } from '@/components/exercises/exercise-table';
import { Lueckentext } from '@/components/ui/lueckentext';
import { MatchingQuiz } from '@/components/exercises/matching-quiz';
import { MultipleChoiceQuiz } from '@/components/ui/multiple-choice-quiz';
import { FormingQuestions } from '@/components/exercises/forming-questions';
import { FormingQuestionsSimple } from '@/components/exercises/forming-questions-simple';
import Satzbildung from '@/components/exercises/satzbildung';
import AuthorCredit from '@/components/exercises/author-credit';
import ExerciseComments from '@/components/exercises/ExerciseComments';

interface MDXComponentsRendererProps {
  content: string;
}

/**
 * Parse FormingQuestions props from component string
 */
function parseFormingQuestionsProps(propsStr: string): {
  title: string;
  statements: string[];
  correctQuestions: string[];
} | null {
  try {
    console.log('[Debug] Parsing FormingQuestions props:', propsStr.substring(0, 300));
    
    // Clean up the props string - preserve newlines for proper array parsing
    const cleanedProps = propsStr.trim();
    
    // Extract title - handle both quoted and unquoted
    const titleMatch = cleanedProps.match(/title=["']([^"']*?)["']/);
    const title = titleMatch ? titleMatch[1] : 'Forming Questions Exercise';
    console.log('[Debug] Parsed title:', title);
    
    // Extract statements array - improved regex to handle multiline with proper escaping
    const statementsMatch = cleanedProps.match(/statements=\{\s*\[([\s\S]*?)\]\s*\}/);
    
    let statements: string[] = [];
    if (statementsMatch && statementsMatch[1]) {
      const arrayContent = statementsMatch[1];
      console.log('[Debug] Statements array content:', arrayContent.substring(0, 200));
      
      // More robust regex to extract quoted strings, handling escaped quotes and multiline
      const stringMatches = arrayContent.match(/"([^"\\]*(\\.[^"\\]*)*)"/g);
      console.log('[Debug] Statements string matches:', stringMatches);
      
      if (stringMatches) {
        statements = stringMatches.map(match => {
          // Remove outer quotes and handle escaped characters
          return match.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        });
      }
    }
    console.log('[Debug] Parsed statements:', statements);
    
    // Extract correctQuestions array with same improved logic
    const correctQuestionsMatch = cleanedProps.match(/correctQuestions=\{\s*\[([\s\S]*?)\]\s*\}/);
    
    let correctQuestions: string[] = [];
    if (correctQuestionsMatch && correctQuestionsMatch[1]) {
      const arrayContent = correctQuestionsMatch[1];
      console.log('[Debug] CorrectQuestions array content:', arrayContent.substring(0, 200));
      
      const stringMatches = arrayContent.match(/"([^"\\]*(\\.[^"\\]*)*)"/g);
      console.log('[Debug] CorrectQuestions string matches:', stringMatches);
      
      if (stringMatches) {
        correctQuestions = stringMatches.map(match => {
          return match.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        });
      }
    }
    console.log('[Debug] Parsed correctQuestions:', correctQuestions);
    
    const result = {
      title,
      statements,
      correctQuestions
    };
    
    console.log('[Debug] Final parsed result:', result);
    
    // Return null if we don't have the essential data
    if (statements.length === 0) {
      console.log('[Debug] No statements found, returning null');
      return null;
    }
    
    return result;
  } catch (error) {
    console.error('Error parsing FormingQuestions props:', error);
    return null;
  }
}

/**
 * Parse MatchingQuiz props from component string
 */
function parseMatchingQuizProps(propsStr: string): {
  title: string;
  questions: string[];
  answers: string[];
  correctPairs: [number, number][];
} | null {
  try {
    // Extract title
    const titleMatch = propsStr.match(/title=\{?"([^"]*?)"\}?/);
    const title = titleMatch ? titleMatch[1] : 'Matching Exercise';
    
    // Extract questions array
    const questionsMatch = propsStr.match(/questions=\{\[([\s\S]*?)\]\}/);
    const questions = questionsMatch ? parseStringArray(questionsMatch[1]) : [];
    
    // Extract answers array
    const answersMatch = propsStr.match(/answers=\{\[([\s\S]*?)\]\}/);
    const answers = answersMatch ? parseStringArray(answersMatch[1]) : [];
    
    // Extract correctPairs array
    const correctPairsMatch = propsStr.match(/correctPairs=\{\[([\s\S]*?)\]\}/);
    const correctPairs = correctPairsMatch ? parseCorrectPairs(correctPairsMatch[1]) : [];
    
    return {
      title,
      questions,
      answers,
      correctPairs
    };
  } catch (error) {
    console.error('Error parsing MatchingQuiz props:', error);
    return null;
  }
}

/**
 * Parse MultipleChoiceQuiz props from component string
 */
function parseMultipleChoiceQuizProps(propsStr: string): {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
} | null {
  try {
    // Extract questions array
    const questionsMatch = propsStr.match(/questions=\{(\[[\s\S]*?\])\}/);
    if (!questionsMatch) {
      console.error('No questions found in MultipleChoiceQuiz props');
      return null;
    }

    let questionsStr = questionsMatch[1];
    console.log('[Debug] Raw questionsStr:', questionsStr.substring(0, 300));
    
    // Manual parsing approach - safer than eval
    const questions: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
    }> = [];
    
    // Extract each question object manually
    const questionBlocks = questionsStr.match(/\{[\s\S]*?\}(?=\s*[,\]])/g);
    if (!questionBlocks) {
      console.error('No question blocks found');
      return null;
    }
    
    for (const block of questionBlocks) {
      try {
        // Extract question
        const questionMatch = block.match(/question:\s*["'](.*?)["']/);
        if (!questionMatch) continue;
        
        // Extract options array
        const optionsMatch = block.match(/options:\s*\[([\s\S]*?)\]/);
        if (!optionsMatch) continue;
        
        // Extract correctAnswer
        const correctAnswerMatch = block.match(/correctAnswer:\s*["'](.*?)["']/);
        if (!correctAnswerMatch) continue;
        
        // Parse options
        const optionsStr = optionsMatch[1];
        const options = optionsStr.match(/["'](.*?)["']/g)?.map(opt => 
          opt.replace(/^["']|["']$/g, '')
        ) || [];
        
        questions.push({
          question: questionMatch[1],
          options: options,
          correctAnswer: correctAnswerMatch[1]
        });
      } catch (blockError) {
        console.warn('Error parsing question block:', blockError);
        continue;
      }
    }
    
    return { questions };
  } catch (error) {
    console.error('Error parsing MultipleChoiceQuiz props:', error);
    return null;
  }
}

/**
 * Parse string array (for questions/answers)
 */
function parseStringArray(arrayStr: string): string[] {
  try {
    const strings = [];
    
    // Remove extra whitespace and newlines for cleaner parsing
    const cleanedStr = arrayStr.replace(/\s+/g, ' ').trim();
    
    // More robust regex to handle strings with special characters
    const regex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
    let match;
    
    while ((match = regex.exec(cleanedStr)) !== null) {
      const cleanString = match[1]
        .replace(/\\"/g, '"') // Handle escaped quotes
        .replace(/\\n/g, '\n') // Handle escaped newlines
        .trim();
      
      if (cleanString) {
        strings.push(cleanString);
      }
    }
    
    return strings;
  } catch (error) {
    console.error('Error parsing string array:', error);
    return [];
  }
}

/**
 * Parse correctPairs array [[0,1], [1,2], etc.]
 */
function parseCorrectPairs(pairsStr: string): [number, number][] {
  try {
    const pairs: [number, number][] = [];
    const regex = /\[\s*(\d+)\s*,\s*(\d+)\s*\]/g;
    let match;
    
    while ((match = regex.exec(pairsStr)) !== null) {
      pairs.push([parseInt(match[1]), parseInt(match[2])]);
    }
    
    return pairs;
  } catch (error) {
    console.error('Error parsing correct pairs:', error);
    return [];
  }
}

/**
 * Parse textParts array for Lueckentext from string
 */
function parseTextPartsArray(textPartsStr: string): any[] {
  try {
    // Clean up the string
    const cleanStr = textPartsStr
      .replace(/\s+/g, ' ')
      .trim();
    
    // Parse mixed array of strings and objects
    // Example: "Text ", { type: "blank", correctAnswer: "answer" }, " more text"
    const parts = [];
    let currentPos = 0;
    
    // Split by comma but be careful with commas inside quotes or objects
    const regex = /("(?:[^"\\]|\\.)*"|\{[^}]*\})/g;
    let match;
    let lastIndex = 0;
    
    while ((match = regex.exec(cleanStr)) !== null) {
      // Add any text before this match
      if (match.index > lastIndex) {
        const beforeText = cleanStr.substring(lastIndex, match.index).replace(/,\s*$/, '').trim();
        if (beforeText && beforeText !== ',') {
          parts.push(beforeText);
        }
      }
      
      const matchedText = match[1];
      if (matchedText.startsWith('"') && matchedText.endsWith('"')) {
        // It's a string
        parts.push(matchedText.slice(1, -1)); // Remove quotes
      } else if (matchedText.startsWith('{') && matchedText.endsWith('}')) {
        // It's an object - parse it
        try {
          const objStr = matchedText
            .replace(/type:\s*"blank"/, '"type": "blank"')
            .replace(/correctAnswer:\s*"([^"]*)"/, '"correctAnswer": "$1"');
          const obj = JSON.parse(objStr);
          parts.push(obj);
        } catch (e) {
          console.error('Error parsing object:', matchedText, e);
        }
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining text
    if (lastIndex < cleanStr.length) {
      const remainingText = cleanStr.substring(lastIndex).replace(/,\s*$/, '').trim();
      if (remainingText && remainingText !== ',') {
        parts.push(remainingText);
      }
    }
    
    return parts;
  } catch (error) {
    console.error('Error parsing textParts array:', error);
    return [];
  }
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
    
    // Try to match individual exercise objects with array answers
    const exerciseRegex = /\{\s*id:\s*(\d+),\s*german:\s*"([^"]+)",\s*correctAnswer:\s*\[([^\]]+)\]\s*\}/g;
    const exercises = [];
    let exerciseMatch;
    
    while ((exerciseMatch = exerciseRegex.exec(cleanStr)) !== null) {
      const id = parseInt(exerciseMatch[1]);
      const german = exerciseMatch[2];
      const answersStr = exerciseMatch[3];
      
      // Parse the array of answers
      const answerMatches = answersStr.match(/"([^"]+)"/g);
      const correctAnswer = answerMatches ? answerMatches.map(match => match.replace(/"/g, '')) : [];
      
      exercises.push({
        id,
        german,
        correctAnswer
      });
    }
    
    // Fallback: try to match old string format
    if (exercises.length === 0) {
      const oldRegex = /\{\s*id:\s*(\d+),\s*german:\s*"([^"]+)",\s*correctAnswer:\s*"([^"]+)"\s*\}/g;
      let oldMatch;
      
      while ((oldMatch = oldRegex.exec(cleanStr)) !== null) {
        exercises.push({
          id: parseInt(oldMatch[1]),
          german: oldMatch[2],
          correctAnswer: oldMatch[3].split(' ')
        });
      }
    }
    
    return exercises;
  } catch (error) {
    console.error('Error parsing exercises array:', error);
    return [];
  }
}

/**
 * Parse Satzbildung props from component string
 */
function parseSatzbildungProps(propsStr: string): {
  sentences: Array<{
    parts: string[];
    correctAnswer: string;
    instruction?: string;
  }>;
  title?: string;
} | null {
  try {
    // Extract title
    const titleMatch = propsStr.match(/title=["']([^"']*?)["']/);
    const title = titleMatch ? titleMatch[1] : 'Satzbildung Exercise';
    
    // Extract sentences array
    const sentencesMatch = propsStr.match(/sentences=\{(\[[\s\S]*?\])\}/);
    if (!sentencesMatch) {
      console.error('No sentences found in Satzbildung props');
      return null;
    }

    let sentencesStr = sentencesMatch[1];
    console.log('[Debug] Raw sentencesStr:', sentencesStr.substring(0, 300));
    
    const sentences: Array<{
      parts: string[];
      correctAnswer: string;
      instruction?: string;
    }> = [];
    
    // Extract each sentence object manually
    const sentenceBlocks = sentencesStr.match(/\{[\s\S]*?\}(?=\s*[,\]])/g);
    if (!sentenceBlocks) {
      console.error('No sentence blocks found');
      return null;
    }
    
    for (const block of sentenceBlocks) {
      try {
        // Extract parts array
        const partsMatch = block.match(/parts:\s*\[([\s\S]*?)\]/);
        if (!partsMatch) continue;
        
        // Extract correctAnswer
        const correctAnswerMatch = block.match(/correctAnswer:\s*["'](.*?)["']/);
        if (!correctAnswerMatch) continue;
        
        // Extract optional instruction
        const instructionMatch = block.match(/instruction:\s*["'](.*?)["']/);
        
        // Parse parts
        const partsStr = partsMatch[1];
        const parts = partsStr.match(/["'](.*?)["']/g)?.map(part => 
          part.replace(/^["']|["']$/g, '')
        ) || [];
        
        const sentenceObj: {
          parts: string[];
          correctAnswer: string;
          instruction?: string;
        } = {
          parts: parts,
          correctAnswer: correctAnswerMatch[1]
        };
        
        if (instructionMatch) {
          sentenceObj.instruction = instructionMatch[1];
        }
        
        sentences.push(sentenceObj);
      } catch (blockError) {
        console.warn('Error parsing sentence block:', blockError);
        continue;
      }
    }
    
    return { sentences, title };
  } catch (error) {
    console.error('Error parsing Satzbildung props:', error);
    return null;
  }
}

/**
 * Simple markdown to HTML converter
 */
function markdownToHtml(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    // Wrap in paragraphs
    .replace(/^(?!<[h1-6]|<p|<div)(.+)/gm, '<p>$1</p>')
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '')
    .replace(/<p><br><\/p>/g, '<br>');
}

/**
 * Client-side MDX components renderer
 */
export function MDXComponentsRenderer({ content }: MDXComponentsRendererProps) {
  const [renderedComponents, setRenderedComponents] = useState<JSX.Element[]>([]);
  const [htmlContent, setHtmlContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);
  const [componentsCount, setComponentsCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    // Processing content for interactive components
    
    try {
    
    console.log('[MDX Client] Starting content processing, length:', content.length);
    console.log('[MDX Client] Raw content preview:', content.substring(0, 500));
    console.log('[MDX Client] ExerciseTable search:', content.includes('<ExerciseTable'));
    console.log('[MDX Client] ExerciseTable search (encoded):', content.includes('\\u003cExerciseTable'));
    console.log('[MDX Client] Full content matches:', content.match(/<ExerciseTable/g)?.length || 0);
    console.log('[MDX Client] FormingQuestions search:', content.includes('<FormingQuestions'));
    console.log('[MDX Client] FormingQuestions matches:', content.match(/<FormingQuestions/g)?.length || 0);
    
    // Decode HTML entities first
    console.log('[MDX Client] Before decoding:', content.includes('<ExerciseTable'), content.includes('\\u003cExerciseTable'));
    console.log('[MDX Client] Content sample (first 300 chars):', JSON.stringify(content.substring(0, 300)));
    
    const decodedContent = content
      .replace(/\\u003c/g, '<')
      .replace(/\\u003e/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/\\u0022/g, '"')
      .replace(/\\u0027/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    console.log('[MDX Client] After decoding:', decodedContent.includes('<ExerciseTable'), decodedContent.substring(0, 500));
    console.log('[MDX Client] ExerciseTable matches after decode:', (decodedContent.match(/<ExerciseTable/g) || []).length);
    
    // Remove frontmatter and imports to get clean content for component parsing
    const cleanContent = decodedContent
      .replace(/^---\n[\s\S]*?\n---\n/, '') // Remove YAML frontmatter
      .replace(/^import\s+.*?from\s+.*?;?\n/gm, ''); // Remove import statements
    
    // Content processing complete
    
    // Extract and parse ExerciseTable, Lueckentext, MatchingQuiz, MultipleChoiceQuiz and FormingQuestions components (JSX format)
    // Updated regex to match single-line format with flexible attribute order
    const exerciseTableRegex = /<ExerciseTable\s+([^>]*?)\s*\/>/g;
    const lueckentextRegex = /<Lueckentext\s+([^>]*?)textParts=\{\[([\s\S]*?)\]\}([^>]*?)\s*\/>/g;
    const matchingQuizRegex = /<MatchingQuiz\s+([\s\S]*?)\s*\/>/g;
    const multipleChoiceQuizRegex = /<MultipleChoiceQuiz\s+([\s\S]*?)\s*\/>/g;
    const formingQuestionsRegex = /<FormingQuestions\s+([\s\S]*?)(?:\s*\/>|>\s*<\/FormingQuestions>)/g;
    const satzbildungRegex = /<Satzbildung\s+([\s\S]*?)\s*\/>/g;
    const authorCreditRegex = /<AuthorCredit\s+author=["']([^"']*?)["']\s*\/>/g;
    
    console.log('[MDX Client] Full content length:', cleanContent.length);
    console.log('[MDX Client] First 500 chars:', cleanContent.substring(0, 500));
    console.log('[MDX Client] Last 500 chars:', cleanContent.substring(cleanContent.length - 500));
    console.log('[MDX Client] FormingQuestions search:', cleanContent.includes('<FormingQuestions'));
    console.log('[MDX Client] FormingQuestions matches:', cleanContent.match(/<FormingQuestions/g)?.length || 0);
    
    // Sample test of the regex
    formingQuestionsRegex.lastIndex = 0;
    const testMatch = formingQuestionsRegex.exec(cleanContent);
    if (testMatch) {
      console.log('[MDX Client] First FormingQuestions match found:', testMatch[0].substring(0, 200));
    } else {
      console.log('[MDX Client] No FormingQuestions match found by regex');
    }
    
    let processedContent = cleanContent;
    const components: JSX.Element[] = [];
    let componentIndex = 0;
    let match;

    // Reset regex lastIndex
    exerciseTableRegex.lastIndex = 0;
    lueckentextRegex.lastIndex = 0;
    matchingQuizRegex.lastIndex = 0;
    multipleChoiceQuizRegex.lastIndex = 0;
    formingQuestionsRegex.lastIndex = 0;
    satzbildungRegex.lastIndex = 0;
    authorCreditRegex.lastIndex = 0;

    while ((match = exerciseTableRegex.exec(cleanContent)) !== null) {
      const [fullMatch, attributesStr] = match;
      
      console.log('[MDX Client] Found ExerciseTable:', { 
        fullMatch: fullMatch.substring(0, 200) + '...', 
        attributesStr: attributesStr.substring(0, 200) + '...'
      });
      
      try {
        // Parse attributes from string
        const titleMatch = attributesStr.match(/title="([^"]*)"/);
        const subtitleMatch = attributesStr.match(/subtitle="([^"]*)"/);
        const exercisesMatch = attributesStr.match(/exercises=\{(\[[\s\S]*?\])\}/);
        
        if (!titleMatch || !subtitleMatch || !exercisesMatch) {
          console.error('[MDX Client] Could not parse ExerciseTable attributes');
          continue;
        }
        
        const title = titleMatch[1];
        const subtitle = subtitleMatch[1];
        const exercisesStr = exercisesMatch[1];
        
        console.log('[MDX Client] Extracted attributes:', { title, subtitle, exercisesLength: exercisesStr.length });
        
        // Parse exercises
        const exercises = parseExercisesArray(exercisesStr);
        
        console.log('[MDX Client] Parsed component:', { title, subtitle, exercisesCount: exercises.length });
        
        if (exercises.length > 0) {
          // Create the component
          const exerciseComponent = (
            <ExerciseTable 
              key={`exercise-${componentIndex}`}
              title={title}
              subtitle={subtitle}
              exercises={exercises}
            />
          );
          
          components.push(exerciseComponent);
          
          // Replace the MDX syntax with a placeholder
          const placeholder = `\n\n[EXERCISE_PLACEHOLDER_${componentIndex}]\n\n`;
          processedContent = processedContent.replace(fullMatch, placeholder);
          componentIndex++;
        }
      } catch (error) {
        console.error('Error processing ExerciseTable:', error);
      }
    }

    // Process Lueckentext components
    lueckentextRegex.lastIndex = 0;
    while ((match = lueckentextRegex.exec(cleanContent)) !== null) {
      const [fullMatch, beforeTextParts, textPartsStr] = match;
      
      console.log('[MDX Client] Found Lueckentext:', { 
        fullMatch: fullMatch.substring(0, 200) + '...', 
        beforeTextParts, 
        textPartsStr: textPartsStr.substring(0, 200) + '...' 
      });
      
      try {
        // Parse title from beforeTextParts
        const titleMatch = beforeTextParts.match(/title="([^"]+)"/);
        const title = titleMatch ? titleMatch[1] : 'Lueckentext Exercise';
        
        // Parse textParts array - this is more complex due to mixed strings and objects
        const textParts = parseTextPartsArray(textPartsStr);
        
        if (textParts && textParts.length > 0) {
          const lueckentextComponent = (
            <Lueckentext
              key={`lueckentext-${componentIndex}`}
              title={title}
              textParts={textParts}
            />
          );
          
          components.push(lueckentextComponent);
          
          // Replace the MDX syntax with a placeholder
          const placeholder = `\n\n[EXERCISE_PLACEHOLDER_${componentIndex}]\n\n`;
          processedContent = processedContent.replace(fullMatch, placeholder);
          componentIndex++;
        }
      } catch (error) {
        console.error('Error processing Lueckentext:', error);
      }
    }

    // Process MatchingQuiz components
    matchingQuizRegex.lastIndex = 0;
    while ((match = matchingQuizRegex.exec(cleanContent)) !== null) {
      const [fullMatch, propsStr] = match;
      
      console.log('[MDX Client] Found MatchingQuiz:', { 
        fullMatch: fullMatch.substring(0, 200) + '...', 
        propsStr: propsStr.substring(0, 200) + '...' 
      });
      
      try {
        // Parse props from the component
        const props = parseMatchingQuizProps(propsStr);
        
        if (props) {
          const matchingQuizComponent = (
            <MatchingQuiz
              key={`matching-quiz-${componentIndex}`}
              title={props.title}
              questions={props.questions}
              answers={props.answers}
              correctPairs={props.correctPairs}
            />
          );
          
          components.push(matchingQuizComponent);
          
          // Replace the MDX syntax with a placeholder
          const placeholder = `\n\n[EXERCISE_PLACEHOLDER_${componentIndex}]\n\n`;
          processedContent = processedContent.replace(fullMatch, placeholder);
          componentIndex++;
        }
      } catch (error) {
        console.error('Error processing MatchingQuiz:', error);
      }
    }

    // Process MultipleChoiceQuiz components
    multipleChoiceQuizRegex.lastIndex = 0;
    while ((match = multipleChoiceQuizRegex.exec(cleanContent)) !== null) {
      const [fullMatch, propsStr] = match;
      
      console.log('[MDX Client] Found MultipleChoiceQuiz:', { 
        fullMatch: fullMatch.substring(0, 200) + '...', 
        propsStr: propsStr.substring(0, 200) + '...' 
      });
      
      try {
        // Parse props from the component
        const props = parseMultipleChoiceQuizProps(propsStr);
        
        if (props && props.questions.length > 0) {
          const multipleChoiceQuizComponent = (
            <MultipleChoiceQuiz
              key={`multiple-choice-quiz-${componentIndex}`}
              questions={props.questions}
            />
          );
          
          components.push(multipleChoiceQuizComponent);
          
          // Replace the MDX syntax with a placeholder
          const placeholder = `\n\n[EXERCISE_PLACEHOLDER_${componentIndex}]\n\n`;
          processedContent = processedContent.replace(fullMatch, placeholder);
          componentIndex++;
        }
      } catch (error) {
        console.error('Error processing MultipleChoiceQuiz:', error);
      }
    }

    // Process FormingQuestions components
    formingQuestionsRegex.lastIndex = 0;
    
    // Use matchAll instead of while loop for reliable regex matching
    const formingQuestionsMatches = Array.from(cleanContent.matchAll(formingQuestionsRegex));
    
    for (const match of formingQuestionsMatches) {
      const [fullMatch, propsStr] = match;
      
      console.log('[Debug] Processing FormingQuestions:', { 
        fullMatch: fullMatch.substring(0, 200) + '...', 
        propsStr: propsStr.substring(0, 200) + '...' 
      });
      
      try {
        // Parse props from the component
        const props = parseFormingQuestionsProps(propsStr);
        
        if (props && props.statements.length > 0) {
          console.log('[Success] FormingQuestions component created with:', {
            title: props.title,
            statementsCount: props.statements.length,
            statements: props.statements,
            correctQuestionsCount: props.correctQuestions.length,
            correctQuestions: props.correctQuestions
          });
          
          const formingQuestionsComponent = (
            <FormingQuestions
              key={`forming-questions-${componentIndex}`}
              title={props.title}
              statements={props.statements}
              correctQuestions={props.correctQuestions}
            />
          );
          
          components.push(formingQuestionsComponent);
          
          // Replace the MDX syntax with a placeholder
          const placeholder = `\n\n[EXERCISE_PLACEHOLDER_${componentIndex}]\n\n`;
          processedContent = processedContent.replace(fullMatch, placeholder);
          componentIndex++;
        }
        
      } catch (error) {
        console.error('Error processing FormingQuestions:', error);
      }
    }

    // Process Satzbildung components
    satzbildungRegex.lastIndex = 0;
    
    // Use matchAll instead of while loop for reliable regex matching
    const satzbildungMatches = Array.from(cleanContent.matchAll(satzbildungRegex));
    
    for (const match of satzbildungMatches) {
      const [fullMatch, propsStr] = match;
      
      console.log('[Debug] Processing Satzbildung:', { 
        fullMatch: fullMatch.substring(0, 200) + '...', 
        propsStr: propsStr.substring(0, 200) + '...' 
      });
      
      try {
        // Parse props from the component
        const props = parseSatzbildungProps(propsStr);
        
        if (props && props.sentences.length > 0) {
          
          const satzbildungComponent = (
            <Satzbildung
              key={`satzbildung-${componentIndex}`}
              exercises={props.sentences.map(sentence => ({
                words: sentence.parts,
                correctSentence: sentence.correctAnswer,
                instruction: sentence.instruction
              }))}
              title={props.title}
            />
          );
          
          components.push(satzbildungComponent);
          
          // Replace the MDX syntax with a placeholder
          const placeholder = `\n\n[EXERCISE_PLACEHOLDER_${componentIndex}]\n\n`;
          processedContent = processedContent.replace(fullMatch, placeholder);
          componentIndex++;
        }
        
      } catch (error) {
        console.error('Error processing Satzbildung:', error);
      }
    }

    // Process AuthorCredit components
    authorCreditRegex.lastIndex = 0;
    
    // Use matchAll instead of while loop for reliable regex matching
    const authorCreditMatches = Array.from(cleanContent.matchAll(authorCreditRegex));
    
    for (const match of authorCreditMatches) {
      const [fullMatch, author] = match;
      
      console.log('[Debug] Processing AuthorCredit:', { fullMatch, author });
      
      try {
        const authorCreditComponent = (
          <AuthorCredit
            key={`author-credit-${componentIndex}`}
            author={author}
          />
        );
        
        components.push(authorCreditComponent);
        
        // Replace the MDX syntax with a placeholder
        const placeholder = `\n\n[EXERCISE_PLACEHOLDER_${componentIndex}]\n\n`;
        processedContent = processedContent.replace(fullMatch, placeholder);
        componentIndex++;
        
      } catch (error) {
        console.error('Error processing AuthorCredit:', error);
      }
    }

    // Process ExerciseComments components  
    const exerciseCommentsRegex = /<ExerciseComments\s+exerciseId=["']([^"']*?)["']\s*(?:url=["']([^"']*?)["'])?\s*\/>/g;
    exerciseCommentsRegex.lastIndex = 0;
    
    console.log('[Debug] Looking for ExerciseComments in content:', cleanContent.includes('ExerciseComments'));
    console.log('[Debug] ExerciseComments regex test:', exerciseCommentsRegex.test(cleanContent));
    exerciseCommentsRegex.lastIndex = 0; // Reset after test
    
    const exerciseCommentsMatches = Array.from(cleanContent.matchAll(exerciseCommentsRegex));
    console.log('[Debug] ExerciseComments matches found:', exerciseCommentsMatches.length);
    
    for (const match of exerciseCommentsMatches) {
      const [fullMatch, exerciseId, url] = match;
      
      console.log('[Debug] Processing ExerciseComments:', { fullMatch, exerciseId, url });
      
      try {
        const exerciseCommentsComponent = (
          <ExerciseComments
            key={`exercise-comments-${componentIndex}`}
            exerciseId={exerciseId}
            url={url}
          />
        );
        
        components.push(exerciseCommentsComponent);
        
        // Replace the MDX syntax with a placeholder
        const placeholder = `\n\n[EXERCISE_PLACEHOLDER_${componentIndex}]\n\n`;
        processedContent = processedContent.replace(fullMatch, placeholder);
        componentIndex++;
        
      } catch (error) {
        console.error('Error processing ExerciseComments:', error);
      }
    }

    // Convert the remaining markdown to HTML
    const html = markdownToHtml(processedContent);
    
    setComponentsCount(components.length);
    setRenderedComponents(components);
    setHtmlContent(html);
    setIsProcessing(false);
    
    // Processing completed successfully
    } catch (error) {
      console.error('[MDX Client] Error processing content:', error);
      setIsProcessing(false);
    }
  }, [content, isMounted]);

  // Don't render anything until mounted to prevent hydration errors
  if (!isMounted) {
    return null;
  }

  // Show processing state for very brief moment
  if (isProcessing) {
    return (
      <div className="animate-pulse">
        Loading exercises... (Content length: {content.length})
        {content.includes('FormingQuestions') && (
          <div className="mt-2 text-xs text-green-600">
            ✓ FormingQuestions detected in content
          </div>
        )}
        {content.includes('<ExerciseTable') && (
          <div className="mt-2 text-xs text-green-600">
            ✓ ExerciseTable detected in content
          </div>
        )}
        <div className="mt-2 text-xs text-blue-600">Components: {componentsCount}</div>
        <div className="mt-2 text-xs text-purple-600">
          useEffect triggered: {Date.now()}
        </div>
      </div>
    );
  }

  // Debug info for development
  const debugMode = false; // Changed to false to show actual components
  if (debugMode) {
    return (
      <div className="border p-4 my-4">
        <h3 className="font-bold text-red-600">DEBUG MODE</h3>
        <div className="text-sm space-y-2">
          <div>Content length: {content.length}</div>
          <div>Contains FormingQuestions: {content.includes('FormingQuestions').toString()}</div>
          <div>Rendered components count: {renderedComponents.length}</div>
          <div className="bg-gray-100 p-2 text-xs max-h-40 overflow-auto">
            <div>Content preview (raw):</div>
            <pre>{content.substring(0, 400)}</pre>
          </div>
          <div className="bg-blue-100 p-2 text-xs max-h-40 overflow-auto">
            <div>Clean content preview:</div>
            <pre>{
              content
                .replace(/\\u003c/g, '<')
                .replace(/\\u003e/g, '>')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .replace(/^---\n[\s\S]*?\n---\n/, '')
                .replace(/^import\s+.*?from\s+.*?;?\n/gm, '')
                .substring(0, 400)
            }</pre>
          </div>
          {renderedComponents.length > 0 && (
            <div className="mt-2">
              <div className="font-semibold text-green-600">Found components:</div>
              {renderedComponents.map((comp, i) => (
                <div key={i} className="ml-4">- Component {i}: {comp.key}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Split HTML content by placeholders and interleave with components
  const renderContent = () => {
    let html = htmlContent;
    const elements: (string | JSX.Element)[] = [];
    
    renderedComponents.forEach((component, index) => {
      const placeholder = `[EXERCISE_PLACEHOLDER_${index}]`;
      const parts = html.split(placeholder);
      
      if (parts.length > 1) {
        elements.push(parts[0]);
        elements.push(component);
        html = parts.slice(1).join(placeholder);
      }
    });
    
    // Add remaining HTML
    if (html) {
      elements.push(html);
    }

    return elements.map((element, index) => {
      if (typeof element === 'string') {
        return (
          <div 
            key={`html-${index}`}
            dangerouslySetInnerHTML={{ __html: element }}
          />
        );
      }
      return element;
    });
  };

  return (
    <div className="prose prose-stone dark:prose-invert max-w-none prose-p:leading-7 prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-2xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1 prose-ul:list-disc prose-ol:list-decimal prose-h1:text-foreground prose-h2:text-foreground prose-h3:text-foreground prose-h4:text-foreground prose-h5:text-foreground prose-h6:text-foreground prose-h1:no-underline prose-h2:no-underline prose-h3:no-underline prose-h4:no-underline prose-h5:no-underline prose-h6:no-underline">
      {renderContent()}
    </div>
  );
}
