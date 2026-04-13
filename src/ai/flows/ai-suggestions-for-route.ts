'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating AI suggestions for travel routes.
 *
 * - aiSuggestionsForRoute - A function that provides AI-driven suggestions for unique places and activities.
 * - AiSuggestionsForRouteInput - The input type for the aiSuggestionsForRoute function.
 * - AiSuggestionsForRouteOutput - The return type for the aiSuggestionsForRoute function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiSuggestionsForRouteInputSchema = z.object({
  destination: z.string().describe('The travel destination, e.g., "Paris, France".'),
  interests: z.array(z.string()).describe('A list of user interests, e.g., ["history", "art", "food"].'),
});
export type AiSuggestionsForRouteInput = z.infer<typeof AiSuggestionsForRouteInputSchema>;

const SuggestionSchema = z.object({
  name: z.string().describe('The name of the suggested place or activity.'),
  description: z.string().describe('A brief description of the suggestion.'),
  type: z.string().describe('The type of suggestion, e.g., "Museum", "Landmark", "Restaurant", "Activity".'),
});

const AiSuggestionsForRouteOutputSchema = z.array(SuggestionSchema).describe('A list of AI-driven suggestions for the travel route.');
export type AiSuggestionsForRouteOutput = z.infer<typeof AiSuggestionsForRouteOutputSchema>;


export async function aiSuggestionsForRoute(input: AiSuggestionsForRouteInput): Promise<AiSuggestionsForRouteOutput> {
  return aiSuggestionsForRouteFlow(input);
}

const aiSuggestionsForRoutePrompt = ai.definePrompt({
  name: 'aiSuggestionsForRoutePrompt',
  input: { schema: AiSuggestionsForRouteInputSchema },
  output: { schema: AiSuggestionsForRouteOutputSchema },
  prompt: `You are an expert travel planner. Based on the user's destination and interests, suggest 4 unique places or activities.

Destination: {{{destination}}}
Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Provide a diverse list of suggestions that might not be on every tourist's radar. For each suggestion, provide a name, a brief compelling description, and a type (e.g., Museum, Landmark, Activity, Walk, Restaurant).`,
});

const aiSuggestionsForRouteFlow = ai.defineFlow(
  {
    name: 'aiSuggestionsForRouteFlow',
    inputSchema: AiSuggestionsForRouteInputSchema,
    outputSchema: AiSuggestionsForRouteOutputSchema,
  },
  async (input) => {
    const { output } = await aiSuggestionsForRoutePrompt(input);
    if (!output) {
      return [];
    }
    return output;
  }
);
