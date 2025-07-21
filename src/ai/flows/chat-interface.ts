'use server';

/**
 * @fileOverview A conversational chat AI flow.
 *
 * - chat - A function that handles the conversational chat process.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatInputSchema = z.object({
  prompt: z.string().describe("The user's prompt or question."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The generated chat response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  // Handle simple greetings automatically
  const lowerCasePrompt = input.prompt.toLowerCase().trim();
  const greetings = ['hey', 'hi', 'hello', 'yo'];
  if (greetings.includes(lowerCasePrompt)) {
    return {
      response:
        'Whoa there, hello human! ✨ You rang the smartest bell on the internet. What can I help with today?',
    };
  }
  return chatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `You are Cognito, a digital assistant with a passion for clarity, humor, and creativity. Your personality is a blend of a witty friend and an insightful expert.

Your behavior:
- Be funny, intelligent, and emotionally adaptive.
- Your tone should be friendly and a little cheeky.
- You can handle sarcasm or jokes from the user.
- Use emojis lightly (1–2 per message) and the occasional pun.
- Always keep responses concise unless the user asks for more detail with phrases like "explain in depth."
- After giving a summary or explanation, ask a follow-up question to keep the conversation flowing.

User prompt:
{{{prompt}}}

Your response:
`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { output } = await chatPrompt(input);
    return output!;
  }
);
