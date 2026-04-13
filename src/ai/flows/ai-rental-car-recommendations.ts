'use server';
/**
 * @fileOverview A Genkit flow for generating AI car rental recommendations.
 *
 * - aiRentalCarRecommendations - A function that provides AI-driven car rental recommendations.
 * - AiRentalCarRecommendationsInput - The input type for the function.
 * - AiRentalCarRecommendationsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiRentalCarRecommendationsInputSchema = z.object({
  location: z.string().describe('The pickup location (city, airport).'),
  startDate: z.string().describe('The start date of the rental in YYYY-MM-DD format.'),
  endDate: z.string().describe('The end date of the rental in YYYY-MM-DD format.'),
  preferences: z.string().describe('User preferences for the car, e.g., "SUV, automatic, for a family of 4".'),
});
export type AiRentalCarRecommendationsInput = z.infer<typeof AiRentalCarRecommendationsInputSchema>;

const CarRecommendationSchema = z.object({
  name: z.string().describe('The transport model name, e.g., "Toyota Camry".'),
  type: z.string().describe('The transport type, e.g., "Седан", "SUV", "Компакт".'),
  supplier: z.string().describe('The rental company name, e.g., "Hertz", "Avis".'),
  pricePerDay: z.string().describe('The estimated price per day, e.g., "₽3500".'),
  rating: z.number().min(1).max(5).describe('The rating of the car/service on a scale of 1 to 5.'),
  features: z.object({
    passengers: z.number().describe('Number of passenger seats.'),
    luggage: z.number().describe('Number of large luggage bags it can fit.'),
    transmission: z.string().describe('Transmission type, e.g., "Автомат" or "Механика".'),
    doors: z.number().describe('Number of doors.'),
  }),
  imageUrl: z.string().url().describe('A URL for an image of the car.'),
});

const AiRentalCarRecommendationsOutputSchema = z.object({
  recommendations: z.array(CarRecommendationSchema).describe('A list of recommended transport for rental.'),
});

export type AiRentalCarRecommendationsOutput = z.infer<typeof AiRentalCarRecommendationsOutputSchema>;

export async function aiRentalCarRecommendations(input: AiRentalCarRecommendationsInput): Promise<AiRentalCarRecommendationsOutput> {
  return aiRentalCarRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiRentalCarRecommendationsPrompt',
  input: {schema: AiRentalCarRecommendationsInputSchema},
  output: {schema: AiRentalCarRecommendationsOutputSchema},
  prompt: `You are an expert in transport rental. Based on the user's location, rental dates, and preferences, suggest 5 suitable rental transport options.

Consider the following details:
Pickup Location: {{{location}}}
Rental Dates: From {{{startDate}}} to {{{endDate}}}
User Preferences: {{{preferences}}}

For each recommendation, provide:
- name: Transport model.
- type: Transport class (e.g., Седан, SUV, Компакт, Эконом, Премиум).
- supplier: Rental company name.
- pricePerDay: Estimated price per day in RUB, e.g., "₽3500".
- rating: A star rating from 1 to 5.
- features: An object with passengers, luggage (number of bags), transmission ("Автомат" or "Механика"), and doors.
- imageUrl: Provide a placeholder image URL from \`https://picsum.photos/seed/{a-random-transport-related-word}/800/600\`.

Ensure the recommendations are diverse and match the user's preferences.`,
});

const aiRentalCarRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiRentalCarRecommendationsFlow',
    inputSchema: AiRentalCarRecommendationsInputSchema,
    outputSchema: AiRentalCarRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get transport rental recommendations from the AI.');
    }
    return output;
  }
);
