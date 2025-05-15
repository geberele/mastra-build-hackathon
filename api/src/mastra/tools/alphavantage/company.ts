import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface CompanyOverviewResponse {
  Symbol: string;
  AssetType: string;
  Name: string;
  Description: string;
  CIK: string;
  Exchange: string;
  Currency: string;
  Country: string;
  Sector: string;
  Industry: string;
  Address: string;
  FiscalYearEnd: string;
  LatestQuarter: string;
  MarketCapitalization: string;
  EBITDA: string;
  PERatio: string;
  PEGRatio: string;
  BookValue: string;
  DividendPerShare: string;
  DividendYield: string;
  EPS: string;
  RevenuePerShareTTM: string;
  ProfitMargin: string;
  OperatingMarginTTM: string;
  ReturnOnAssetsTTM: string;
  ReturnOnEquityTTM: string;
  RevenueTTM: string;
  GrossProfitTTM: string;
  QuarterlyEarningsGrowthYOY: string;
  QuarterlyRevenueGrowthYOY: string;
  AnalystTargetPrice: string;
  TrailingPE: string;
  ForwardPE: string;
  PriceToSalesRatioTTM: string;
  PriceToBookRatio: string;
  EVToRevenue: string;
  EVToEBITDA: string;
  Beta: string;
  '52WeekHigh': string;
  '52WeekLow': string;
  '50DayMovingAverage': string;
  '200DayMovingAverage': string;
  SharesOutstanding: string;
  SharesFloat: string;
  SharesShort: string;
  SharesShortPriorMonth: string;
  ShortRatio: string;
  ShortPercentOutstanding: string;
  ShortPercentFloat: string;
  PercentInsiders: string;
  PercentInstitutions: string;
  ForwardAnnualDividendRate: string;
  ForwardAnnualDividendYield: string;
  PayoutRatio: string;
  DividendDate: string;
  ExDividendDate: string;
  LastSplitFactor: string;
  LastSplitDate: string;
}

export const companyTool = createTool({
  id: 'get-company-overview',
  description: 'Get detailed company overview information for a given stock symbol using Alpha Vantage API',
  inputSchema: z.object({
    symbol: z.string().describe('Stock ticker symbol (e.g., TSLA)'),
  }),
  outputSchema: z.object({
    symbol: z.string(),
    name: z.string(),
    description: z.string(),
    sector: z.string(),
    industry: z.string(),
    marketCap: z.number(),
    peRatio: z.number().nullable(),
    eps: z.number().nullable(),
    dividendYield: z.number().nullable(),
    beta: z.number().nullable(),
    fiftyTwoWeekHigh: z.number().nullable(),
    fiftyTwoWeekLow: z.number().nullable(),
    fiftyDayMovingAverage: z.number().nullable(),
    twoHundredDayMovingAverage: z.number().nullable(),
  }),
  execute: async ({ context }) => {
    return await getCompanyOverview(context.symbol);
  },
});

const getCompanyOverview = async (symbol: string) => {
  console.log(`[Company Tool] Fetching company overview for symbol: ${symbol}`);
  
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    console.error('[Company Tool] Alpha Vantage API key not found in environment variables');
    throw new Error('Alpha Vantage API key not configured');
  }

  const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
  console.log(`[Company Tool] Making API request to: ${url}`);
  
  const response = await fetch(url);
  const data = (await response.json()) as CompanyOverviewResponse;
  
  console.log(`[Company Tool] Received response for ${symbol}:`, {
    hasData: !!data.Symbol,
    name: data.Name,
    sector: data.Sector,
  });

  if (!data.Symbol) {
    console.error(`[Company Tool] No data found for symbol: ${symbol}`);
    throw new Error(`Company overview not found for symbol '${symbol}'`);
  }

  // Helper function to safely parse numeric strings
  const parseNumeric = (value: string | undefined): number | null => {
    if (!value || value === 'None') return null;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  };

  console.log(`[Company Tool] Processing data for ${symbol}:`, {
    name: data.Name,
    marketCap: parseNumeric(data.MarketCapitalization),
    peRatio: parseNumeric(data.PERatio),
  });

  return {
    symbol: data.Symbol,
    name: data.Name,
    description: data.Description,
    sector: data.Sector,
    industry: data.Industry,
    marketCap: parseNumeric(data.MarketCapitalization) || 0,
    peRatio: parseNumeric(data.PERatio),
    eps: parseNumeric(data.EPS),
    dividendYield: parseNumeric(data.DividendYield),
    beta: parseNumeric(data.Beta),
    fiftyTwoWeekHigh: parseNumeric(data['52WeekHigh']),
    fiftyTwoWeekLow: parseNumeric(data['52WeekLow']),
    fiftyDayMovingAverage: parseNumeric(data['50DayMovingAverage']),
    twoHundredDayMovingAverage: parseNumeric(data['200DayMovingAverage']),
  };
}; 