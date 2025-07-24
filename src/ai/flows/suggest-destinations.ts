// use server'
'use server';
/**
 * @fileOverview AI tool analyzes the travel landscape for new destinations based on a region the user inputs.
 *
 * - suggestDestinations - A function that suggests destinations based on a region.
 * - SuggestDestinationsInput - The input type for the suggestDestinations function.
 * - SuggestDestinationsOutput - The return type for the suggestDestinations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDestinationsInputSchema = z.object({
  region: z.string().describe('The region for which to suggest travel destinations.'),
});
export type SuggestDestinationsInput = z.infer<typeof SuggestDestinationsInputSchema>;

const SuggestDestinationsOutputSchema = z.object({
  destinations: z
    .array(z.string())
    .describe('An array of suggested travel destinations.'),
});
export type SuggestDestinationsOutput = z.infer<typeof SuggestDestinationsOutputSchema>;

export async function suggestDestinations(
  input: SuggestDestinationsInput
): Promise<SuggestDestinationsOutput> {
  return suggestDestinationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDestinationsPrompt',
  input: {schema: SuggestDestinationsInputSchema},
  output: {schema: SuggestDestinationsOutputSchema},
  prompt: `You are a travel expert. Suggest some travel destinations in the following region: {{{region}}}. Return the list of destinations.`,
});

const suggestDestinationsFlow = ai.defineFlow(
  {
    name: 'suggestDestinationsFlow',
    inputSchema: SuggestDestinationsInputSchema,
    outputSchema: SuggestDestinationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
