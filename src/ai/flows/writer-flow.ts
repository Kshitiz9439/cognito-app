'use server';

/**
 * @fileOverview A creative writing AI flow.
 *
 * - creativeWriter - A function that generates a short story.
 * - CreativeWriterInput - The input type for the creativeWriter function.
 * - CreativeWriterOutput - The return type for the creativeWriter function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CreativeWriterInputSchema = z.object({
  topic: z.string().describe('The topic or prompt for the story.'),
  genre: z.string().describe('The genre of the story.'),
});
export type CreativeWriterInput = z.infer<typeof CreativeWriterInputSchema>;

const CreativeWriterOutputSchema = z.object({
  story: z.string().describe('The generated short story.'),
});
export type CreativeWriterOutput = z.infer<typeof CreativeWriterOutputSchema>;

export async function creativeWriter(input: CreativeWriterInput): Promise<CreativeWriterOutput> {
  return creativeWriterFlow(input);
}

const writerPrompt = ai.definePrompt({
  name: 'writerPrompt',
  input: { schema: CreativeWriterInputSchema },
  output: { schema: CreativeWriterOutputSchema },
  prompt: `You are Cognito, a creative writing assistant.
Write a short, engaging story in the {{genre}} genre based on the following topic.
Make it imaginative and well-structured.

Topic: {{{topic}}}

Story:
`,
});

const creativeWriterFlow = ai.defineFlow(
  {
    name: 'creativeWriterFlow',
    inputSchema: CreativeWriterInputSchema,
    outputSchema: CreativeWriterOutputSchema,
  },
  async (input) => {
    const { output } = await writerPrompt(input);
    return output!;
  }
);
