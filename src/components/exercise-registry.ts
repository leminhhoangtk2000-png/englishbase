/**
 * Exercise & MDX Components Registry
 * 
 * File này quản lý tất cả components liên quan đến bài tập và MDX
 * Giúp dễ dàng import và sử dụng trong các file MDX
 */

// =============================================================================
// EXERCISE COMPONENTS - Các components bài tập tương tác
// =============================================================================

// Basic Exercise Types
import Lueckentext from './exercises/Lueckentext'
import MultipleChoice from './exercises/MultipleChoice'
import MatchingExercise from './exercises/MatchingExercise'
import WritingExercise from './exercises/WritingExercise'

// Learning Support Components
import GrammarBox from './exercises/GrammarBox'
import VocabularyList from './exercises/VocabularyList'

// Content & Social Components
import AuthorCredit from './exercises/AuthorCredit'
import FacebookComments from './exercises/FacebookComments'

// Re-export for easy import
export { 
  Lueckentext,
  MultipleChoice,
  MatchingExercise,
  WritingExercise,
  GrammarBox,
  VocabularyList,
  AuthorCredit,
  FacebookComments
}

// =============================================================================
// PLANNED EXERCISE COMPONENTS - Components sẽ được thêm trong tương lai
// =============================================================================

// Advanced Exercise Types (TODO)
// export { default as DragDropExercise } from './exercises/DragDropExercise'
// export { default as ListeningExercise } from './exercises/ListeningExercise' 
// export { default as SpeakingExercise } from './exercises/SpeakingExercise'
// export { default as ReadingComprehension } from './exercises/ReadingComprehension'

// Specialized Grammar Components (TODO)
// export { default as VerbConjugation } from './exercises/VerbConjugation'
// export { default as CaseExercise } from './exercises/CaseExercise'
// export { default as WordOrderExercise } from './exercises/WordOrderExercise'

// Assessment & Progress Components (TODO)
// export { default as QuizBuilder } from './exercises/QuizBuilder'
// export { default as ProgressTracker } from './exercises/ProgressTracker'
// export { default as LevelTest } from './exercises/LevelTest'

// Multimedia Components (TODO)
// export { default as AudioPlayer } from './exercises/AudioPlayer'
// export { default as VideoPlayer } from './exercises/VideoPlayer'
// export { default as ImageAnnotation } from './exercises/ImageAnnotation'

// =============================================================================
// MDX UTILITIES - Tiện ích cho MDX
// =============================================================================

// MDX Processing Functions
export { 
  getMDXFile, 
  getMDXTableOfContents, 
  getAllMDXFiles 
} from '../lib/mdx'

// Markdown Processing Functions
export {
  getMarkdownFiles,
  type MarkdownContent,
  type MarkdownMeta,
  type MarkdownSection
} from '../lib/markdown'

// =============================================================================
// COMPONENT GROUPS - Nhóm components theo chức năng
// =============================================================================

// Interactive Exercise Components
export const InteractiveExercises = {
  Lueckentext,
  MultipleChoice, 
  MatchingExercise,
  WritingExercise
} as const

// Learning Support Components
export const LearningSupportComponents = {
  GrammarBox,
  VocabularyList
} as const

// Content Management Components  
export const ContentComponents = {
  AuthorCredit,
  FacebookComments
} as const

// =============================================================================
// TYPE DEFINITIONS - Định nghĩa types chung
// =============================================================================

export interface ExerciseResult {
  score: number
  totalQuestions: number
  percentage: number
  feedback: 'excellent' | 'good' | 'needs-improvement'
}

export interface ExerciseProps {
  title?: string
  difficulty?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  category?: string
  timeLimit?: number // seconds
  showHints?: boolean
  allowRetry?: boolean
}

export interface VocabularyWord {
  german: string
  vietnamese: string
  pronunciation?: string
  example?: string
  exampleTranslation?: string
  category?: string
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  audioUrl?: string
  imageUrl?: string
}

export interface GrammarRule {
  rule: string
  explanation: string
  examples: string[]
  counterExamples?: string[]
}

// =============================================================================
// CONFIGURATION - Cấu hình mặc định
// =============================================================================

export const ExerciseConfig = {
  // Default scoring thresholds
  scoring: {
    excellent: 80,
    good: 60,
    needsImprovement: 0
  },
  
  // Default colors for each component type
  colors: {
    lueckentext: 'blue',
    multipleChoice: 'purple',
    matching: 'green', 
    writing: 'yellow',
    grammar: 'indigo',
    vocabulary: 'teal'
  },
  
  // Animation durations (ms)
  animations: {
    cardFlip: 500,
    fadeIn: 300,
    slideIn: 400
  },
  
  // Default time limits (seconds)
  timeouts: {
    lueckentext: 300,
    multipleChoice: 240,
    matching: 180,
    writing: 900
  }
} as const

// =============================================================================
// UTILITY FUNCTIONS - Hàm tiện ích
// =============================================================================

/**
 * Calculate exercise score and feedback
 */
export function calculateScore(correct: number, total: number): ExerciseResult {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
  
  let feedback: ExerciseResult['feedback'] = 'needs-improvement'
  if (percentage >= ExerciseConfig.scoring.excellent) {
    feedback = 'excellent'
  } else if (percentage >= ExerciseConfig.scoring.good) {
    feedback = 'good'
  }
  
  return {
    score: correct,
    totalQuestions: total,
    percentage,
    feedback
  }
}

/**
 * Get feedback message based on score
 */
export function getFeedbackMessage(feedback: ExerciseResult['feedback']): string {
  switch (feedback) {
    case 'excellent':
      return 'Xuất sắc! 🌟'
    case 'good':
      return 'Khá tốt! 👍'
    case 'needs-improvement':
      return 'Cần cải thiện 📚'
    default:
      return 'Hoàn thành!'
  }
}

/**
 * Get color class based on component type
 */
export function getComponentColor(type: keyof typeof ExerciseConfig.colors): string {
  return ExerciseConfig.colors[type] || 'gray'
}

/**
 * Format time duration
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${seconds}s`
}

/**
 * Validate exercise data
 */
export function validateExerciseData(data: any, type: string): boolean {
  try {
    switch (type) {
      case 'lueckentext':
        return Array.isArray(data.textParts) && data.textParts.length > 0
      case 'multipleChoice':
        return Array.isArray(data.questions) && data.questions.every((q: any) => 
          q.question && Array.isArray(q.options) && q.options.length > 0
        )
      case 'matching':
        return Array.isArray(data.items) && data.items.every((item: any) => 
          item.id && item.left && item.right
        )
      case 'writing':
        return data.prompt && data.prompt.question
      case 'vocabulary':
        return Array.isArray(data.words) && data.words.every((word: any) => 
          word.german && word.vietnamese
        )
      case 'grammar':
        return Array.isArray(data.rules) && data.rules.every((rule: any) => 
          rule.rule && rule.explanation && Array.isArray(rule.examples)
        )
      default:
        return false
    }
  } catch {
    return false
  }
}

// =============================================================================
// HOOKS - Custom hooks cho exercises
// =============================================================================

import { useState, useEffect, useCallback } from 'react'

/**
 * Hook for managing exercise state
 */
export function useExerciseState(initialData: any = {}) {
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  
  const resetExercise = useCallback(() => {
    setAnswers({})
    setShowFeedback(false)
    setStartTime(Date.now())
    setEndTime(null)
  }, [])
  
  const submitExercise = useCallback(() => {
    setShowFeedback(true)
    setEndTime(Date.now())
  }, [])
  
  const getDuration = useCallback(() => {
    if (!startTime || !endTime) return 0
    return Math.floor((endTime - startTime) / 1000)
  }, [startTime, endTime])
  
  useEffect(() => {
    setStartTime(Date.now())
  }, [])
  
  return {
    answers,
    setAnswers,
    showFeedback,
    resetExercise,
    submitExercise,
    getDuration
  }
}

/**
 * Hook for text-to-speech functionality
 */
export function useTextToSpeech() {
  const speak = useCallback((text: string, lang: string = 'de-DE') => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = 0.8
      utterance.pitch = 1
      
      speechSynthesis.speak(utterance)
    } else {
      console.warn('Text-to-speech not supported in this browser')
    }
  }, [])
  
  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
  }, [])
  
  return { speak, stop }
}

// =============================================================================
// CONSTANTS - Hằng số
// =============================================================================

export const EXERCISE_TYPES = {
  LUECKENTEXT: 'lueckentext',
  MULTIPLE_CHOICE: 'multipleChoice',
  MATCHING: 'matching',
  WRITING: 'writing',
  GRAMMAR: 'grammar',
  VOCABULARY: 'vocabulary'
} as const

export const DIFFICULTY_LEVELS = {
  A1: 'A1',
  A2: 'A2', 
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
  C2: 'C2'
} as const

export const CATEGORIES = {
  GRAMMAR: 'Ngữ pháp',
  VOCABULARY: 'Từ vựng',
  LISTENING: 'Nghe',
  SPEAKING: 'Nói',
  READING: 'Đọc',
  WRITING: 'Viết'
} as const
