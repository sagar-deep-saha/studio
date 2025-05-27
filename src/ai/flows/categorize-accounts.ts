'use server';

/**
 * @fileOverview Account categorization AI agent.
 *
 * - categorizeAccounts - A function that categorizes accounts based on their name and description.
 * - CategorizeAccountsInput - The input type for the categorizeAccounts function.
 * - CategorizeAccountsOutput - The return type for the categorizeAccounts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeAccountsInputSchema = z.object({
  accountName: z.string().describe('The name of the account.'),
  accountDescription: z.string().describe('A description of the account.'),
});
export type CategorizeAccountsInput = z.infer<typeof CategorizeAccountsInputSchema>;

const CategorizeAccountsOutputSchema = z.object({
  category: z.string().describe('The category of the account.'),
  confidence: z.number().describe('The confidence level of the categorization (0-1).'),
});
export type CategorizeAccountsOutput = z.infer<typeof CategorizeAccountsOutputSchema>;

export async function categorizeAccounts(input: CategorizeAccountsInput): Promise<CategorizeAccountsOutput> {
  return categorizeAccountsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeAccountsPrompt',
  input: {schema: CategorizeAccountsInputSchema},
  output: {schema: CategorizeAccountsOutputSchema},
  prompt: `You are an expert account categorizer. You will categorize the account based on its name and description.

  Account Name: {{{accountName}}}
  Account Description: {{{accountDescription}}}

  Respond with a category and a confidence level between 0 and 1.
  The confidence level represents how confident you are in the categorization.
  Example: { \"category\": \"Email\", \"confidence\": 0.95 }`,
});

const categorizeAccountsFlow = ai.defineFlow(
  {
    name: 'categorizeAccountsFlow',
    inputSchema: CategorizeAccountsInputSchema,
    outputSchema: CategorizeAccountsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
