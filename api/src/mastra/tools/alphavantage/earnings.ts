import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface EarningsResponse {
  symbol: string;
  annualEarnings: Array<{
    fiscalDateEnding: string;
    reportedEPS: string;
    estimatedEPS: string;
    surprise: string;
    surprisePercentage: string;
  }>;
  quarterlyEarnings: Array<{
    fiscalDateEnding: string;
    reportedDate: string;
    reportedEPS: string;
    estimatedEPS: string;
    surprise: string;
    surprisePercentage: string;
  }>;
}

export const earningsTool = createTool({
  id: 'get-company-earnings',
  description: 'Get historical earnings data for a given stock symbol using Alpha Vantage API',
  inputSchema: z.object({
    symbol: z.string().describe('Stock ticker symbol (e.g., TSLA)'),
  }),
  outputSchema: z.object({
    symbol: z.string(),
    annualEarnings: z.array(z.object({
      fiscalDateEnding: z.string(),
      reportedEPS: z.number().nullable(),
      estimatedEPS: z.number().nullable(),
      surprise: z.number().nullable(),
      surprisePercentage: z.number().nullable(),
    })),
    quarterlyEarnings: z.array(z.object({
      fiscalDateEnding: z.string(),
      reportedDate: z.string(),
      reportedEPS: z.number().nullable(),
      estimatedEPS: z.number().nullable(),
      surprise: z.number().nullable(),
      surprisePercentage: z.number().nullable(),
    })),
  }),
  execute: async ({ context }) => {
    return await getEarningsData(context.symbol);
  },
});

const getEarningsData = async (symbol: string) => {
  console.log(`[Earnings Tool] Fetching earnings data for symbol: ${symbol}`);
  
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    console.error('[Earnings Tool] Alpha Vantage API key not found in environment variables');
    throw new Error('Alpha Vantage API key not configured');
  }

  const url = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${symbol}&apikey=${apiKey}`;
  console.log(`[Earnings Tool] Making API request to: ${url}`);
  
  const response = await fetch(url);
  const data = (await response.json()) as EarningsResponse;
  
  console.log(`[Earnings Tool] Received response for ${symbol}:`, {
    hasData: !!data.symbol,
    annualEarningsCount: data.annualEarnings?.length || 0,
    quarterlyEarningsCount: data.quarterlyEarnings?.length || 0,
  });

  if (!data.symbol) {
    console.error(`[Earnings Tool] No data found for symbol: ${symbol}`);
    throw new Error(`Earnings data not found for symbol '${symbol}'`);
  }

  // Helper function to safely parse numeric strings
  const parseNumeric = (value: string | undefined): number | null => {
    if (!value || value === 'None') return null;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  };

  // Process annual earnings
  const annualEarnings = data.annualEarnings.map(earning => ({
    fiscalDateEnding: earning.fiscalDateEnding,
    reportedEPS: parseNumeric(earning.reportedEPS),
    estimatedEPS: parseNumeric(earning.estimatedEPS),
    surprise: parseNumeric(earning.surprise),
    surprisePercentage: parseNumeric(earning.surprisePercentage),
  }));

  // Process quarterly earnings
  const quarterlyEarnings = data.quarterlyEarnings.map(earning => ({
    fiscalDateEnding: earning.fiscalDateEnding,
    reportedDate: earning.reportedDate,
    reportedEPS: parseNumeric(earning.reportedEPS),
    estimatedEPS: parseNumeric(earning.estimatedEPS),
    surprise: parseNumeric(earning.surprise),
    surprisePercentage: parseNumeric(earning.surprisePercentage),
  }));

  console.log(`[Earnings Tool] Processing data for ${symbol}:`, {
    annualEarningsCount: annualEarnings.length,
    quarterlyEarningsCount: quarterlyEarnings.length,
    latestQuarterlyEPS: quarterlyEarnings[0]?.reportedEPS,
  });

  return {
    symbol: data.symbol,
    annualEarnings,
    quarterlyEarnings,
  };
}; 