'use server';

/**
 * @fileOverview AI agent to suggest daily goals based on user data and preferences.
 *
 * - suggestDailyGoals - A function that suggests daily goals.
 * - SuggestDailyGoalsInput - The input type for the suggestDailyGoals function.
 * - SuggestDailyGoalsOutput - The return type for the suggestDailyGoals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDailyGoalsInputSchema = z.object({
  pastActivityData: z
    .string()
    .describe(
      'A stringified JSON array containing the user\'s past activity data, including exercise, meals, and water intake. Each object should include the type of activity, quantity, and date.'
    ),
  pastMetricData: z
    .string()
    .describe(
      'A stringified JSON array containing the user\'s past health metrics, including steps taken, hours slept, and mood levels. Each object should include the metric type, value, and date.'
    ),
  userPreferences: z
    .string()
    .describe(
      'A stringified JSON object containing the user\'s preferences for goal setting, including preferred activity types, desired intensity, and any specific health goals.'
    ),
});
export type SuggestDailyGoalsInput = z.infer<typeof SuggestDailyGoalsInputSchema>;

const SuggestDailyGoalsOutputSchema = z.object({
  suggestedGoals: z
    .string()
    .describe(
      'A stringified JSON array of suggested daily goals, based on the user\'s past data and preferences. Each object should include the activity type, target quantity, and a short explanation of why the goal is recommended.'
    ),
});
export type SuggestDailyGoalsOutput = z.infer<typeof SuggestDailyGoalsOutputSchema>;

export async function suggestDailyGoals(
  input: SuggestDailyGoalsInput
): Promise<SuggestDailyGoalsOutput> {
  return suggestDailyGoalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDailyGoalsPrompt',
  input: {schema: SuggestDailyGoalsInputSchema},
  output: {schema: SuggestDailyGoalsOutputSchema},
  prompt: `You are an AI health assistant that suggests achievable daily goals for users based on their logged data and preferences.

  Analyze the user's past activity data, health metrics, and preferences to generate personalized and achievable daily goals.

  The goals should be specific, measurable, and tailored to the user's individual needs and preferences.

  Consider the user's success rate with past goals and adjust the recommendations accordingly to encourage continued progress.

  Return the suggested goals as a JSON array of objects, where each object includes the activity type, target quantity, and a short explanation of why the goal is recommended.

  Past Activity Data: {{{pastActivityData}}}
  Past Metric Data: {{{pastMetricData}}}
  User Preferences: {{{userPreferences}}}
  \n  Make sure that the {{suggestedGoals}} are achievable and promote consistent progress.
  `,
});

const suggestDailyGoalsFlow = ai.defineFlow(
  {
    name: 'suggestDailyGoalsFlow',
    inputSchema: SuggestDailyGoalsInputSchema,
    outputSchema: SuggestDailyGoalsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
