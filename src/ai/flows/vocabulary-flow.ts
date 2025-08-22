'use server';
/**
 * @fileOverview A German-Vietnamese vocabulary translation AI flow.
 *
 * - translateWord - A function that handles the vocabulary translation process.
 * - VocabularyInput - The input type for the translateWord function.
 * - VocabularyOutput - The return type for the translateWord function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const VocabularyInputSchema = z.object({
  word: z.string().describe('The German word to be translated.'),
});
export type VocabularyInput = z.infer<typeof VocabularyInputSchema>;

const VocabularyOutputSchema = z.object({
  german: z.string().describe('The German word with its article (der, die, das).'),
  plural: z.string().describe('The plural form of the German word.'),
  phonetic: z.string().describe('The phonetic transcription of the word.'),
  vietnamese: z.string().describe('The Vietnamese translation of the word.'),
  type: z.string().describe('The word type (e.g., Nomen, Verb, Adjektiv).'),
  level: z.string().describe('The CEFR level of the word (e.g., A1, A2, B1).'),
  exampleGerman: z.string().describe('An example sentence in German using the word.'),
  exampleVietnamese: z.string().describe('The Vietnamese translation of the example sentence.'),
});
export type VocabularyOutput = z.infer<typeof VocabularyOutputSchema>;

export async function translateWord(input: VocabularyInput): Promise<VocabularyOutput> {
  return vocabularyFlow(input);
}

const vocabularyPrompt = ai.definePrompt({
  name: 'vocabularyPrompt',
  input: { schema: VocabularyInputSchema },
  output: { schema: VocabularyOutputSchema },
  prompt: `You are an expert German-Vietnamese dictionary. Your task is to provide detailed information for a given German word.

Given the word "{{word}}", provide the following information in the specified JSON format:
1.  **german**: The word itself, including its correct article (der, die, or das) if it's a noun.
2.  **plural**: The plural form of the word. If it doesn't have a plural, return "-".
3.  **phonetic**: The phonetic transcription of the word.
4.  **vietnamese**: The primary Vietnamese translation.
5.  **type**: The grammatical type of the word (e.g., "Nomen", "Verb", "Adjektiv").
6.  **level**: The estimated CEFR level for this word (e.g., "A1", "A2", "B1").
7.  **exampleGerman**: A simple and practical example sentence in German that uses the word.
8.  **exampleVietnamese**: The accurate Vietnamese translation of the example sentence.

Please ensure the output is only the JSON object.`,
});

const vocabularyFlow = ai.defineFlow(
  {
    name: 'vocabularyFlow',
    inputSchema: VocabularyInputSchema,
    outputSchema: VocabularyOutputSchema,
  },
  async (input) => {
    const { output } = await vocabularyPrompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI model.');
    }
    return output;
  }
);
