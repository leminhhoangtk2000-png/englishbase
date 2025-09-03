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
  prompt: `You are an expert German-Vietnamese dictionary for language learners. Create vocabulary cards that exactly match this format:

🎯 **STANDARDIZED VOCABULARY CARD FORMAT:**

For the word "{{word}}", provide:

1. **german**: The complete German word with article (der/die/das) if it's a noun
   - Example: "das Haus" (not just "Haus")
   - For verbs: "lernen" 
   - For adjectives: "schön"

2. **plural**: Plural form (use "-" if no plural exists)
   - Example: "die Häuser" or "-"

3. **phonetic**: IPA phonetic transcription in forward slashes
   - Example: "/haʊs/" 
   - Must be accurate German pronunciation

4. **vietnamese**: Primary Vietnamese translation (clear and concise)
   - Example: "ngôi nhà, nhà ở"
   - Use natural Vietnamese expressions

5. **type**: German grammatical term
   - Use: "Nomen", "Verb", "Adjektiv", "Adverb", "Präposition", etc.
   - Must be in German language

6. **level**: CEFR level assessment
   - Choose from: A1, A2, B1, B2, C1, C2
   - Base on common usage frequency

7. **exampleGerman**: Natural German sentence using the word
   - Keep it simple and practical
   - Must contain the exact word form
   - Example: "Mein Haus ist sehr groß."

8. **exampleVietnamese**: Accurate Vietnamese translation of the example
   - Natural Vietnamese sentence structure
   - Example: "Nhà của tôi rất lớn."

🔄 **CONSISTENCY REQUIREMENTS:**
- Always include articles for nouns
- Use proper IPA notation for phonetics  
- Keep Vietnamese translations clear and practical
- Ensure examples are beginner-friendly
- Use standard German grammatical terms

Return ONLY the JSON object with no additional text.`,
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
