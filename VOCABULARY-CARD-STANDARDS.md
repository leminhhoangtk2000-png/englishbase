# Vocabulary Card Standardization Guide

## Overview
This document outlines the standardized format for vocabulary cards in the die-neuen section to ensure consistent AI-generated vocabulary responses.

## Standardized Vocabulary Card Format

When AI generates vocabulary entries through the `/api/vocabulary/ai-search` endpoint, the response follows this exact structure:

### 1. **German Word** (`german`)
- **Format**: Complete word with article for nouns
- **Examples**: 
  - Nouns: "das Haus", "die Energiepolitik", "der Wohnungsbau"
  - Verbs: "lernen", "entwickeln", "revolutionieren"
  - Adjectives: "nachhaltig", "digital", "modern"

### 2. **Plural Form** (`plural`)
- **Format**: Plural form or "-" if no plural exists
- **Examples**: "die Häuser", "die Strategien", "-"

### 3. **Phonetic Transcription** (`phonetic`)
- **Format**: IPA notation in forward slashes
- **Examples**: "/haʊs/", "/eˈnɛʁɡiːpoliˌtiːk/"
- **Requirement**: Must be accurate German pronunciation

### 4. **Vietnamese Translation** (`vietnamese`)
- **Format**: Clear, natural Vietnamese translation
- **Examples**: "ngôi nhà, nhà ở", "chính sách năng lượng"
- **Requirement**: Use practical, commonly understood terms

### 5. **Word Type** (`type`)
- **Format**: German grammatical terms
- **Options**: "Nomen", "Verb", "Adjektiv", "Adverb", "Präposition", etc.
- **Requirement**: Must be in German language

### 6. **CEFR Level** (`level`)
- **Format**: Standard CEFR levels
- **Options**: A1, A2, B1, B2, C1, C2
- **Basis**: Common usage frequency and complexity

### 7. **German Example** (`exampleGerman`)
- **Format**: Natural, practical German sentence
- **Requirement**: Must contain the exact word form
- **Target**: Beginner-friendly complexity

### 8. **Vietnamese Example** (`exampleVietnamese`)
- **Format**: Accurate Vietnamese translation of German example
- **Requirement**: Natural Vietnamese sentence structure

## Implementation

### AI Flow Location
- **File**: `src/ai/flows/vocabulary-flow.ts`
- **Function**: `vocabularyPrompt`
- **Output Schema**: `VocabularyOutputSchema`

### API Integration
- **Endpoint**: `/api/vocabulary/ai-search`
- **Method**: POST
- **Body**: `{ word: string }`
- **Response**: Standardized vocabulary entry

### Component Display
- **Component**: `VocabularyCard` in `src/components/vocabulary-search/vocabulary-card.tsx`
- **Usage**: Die-neuen article pages with VocabularySidebar
- **Features**: TTS support, save functionality, responsive design

## Data Flow

1. **User searches word** in VocabularySidebar
2. **Hook calls API** (`useVocabularySearch` → `/api/vocabulary/ai-search`)
3. **API checks database** for existing entry
4. **If not found, AI generates** using standardized prompt
5. **Result saved to database** and returned to user
6. **VocabularyCard displays** in consistent format

## Quality Standards

### Consistency Requirements
- Always include articles for German nouns
- Use proper IPA notation for phonetics
- Keep Vietnamese translations clear and practical
- Ensure examples are beginner-friendly
- Use standard German grammatical terms

### User Experience
- Vocabulary cards provide TTS (Text-to-Speech) functionality
- Users can save words to their personal vocabulary collection
- Responsive design works on mobile and desktop
- Loading states and error handling for smooth UX

## Testing

To verify the standardization works correctly:

1. Search for new German words in die-neuen articles
2. Verify AI responses match the format requirements
3. Check that saved vocabulary maintains consistency
4. Test TTS functionality with generated phonetics

## Future Enhancements

- **Synonyms and Antonyms**: Consider adding to AI output schema
- **Related Words**: Context-aware vocabulary suggestions
- **Difficulty Scoring**: Advanced level assessment
- **Usage Statistics**: Track most searched vocabulary
