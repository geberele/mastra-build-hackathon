import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import yahooFinance from 'yahoo-finance2';

// Quote Tool
export const yahooQuoteTool = createTool({
  id: 'get-yahoo-quote',
  description: 'Get real-time stock quote data from Yahoo Finance',
  inputSchema: z.object({
    symbol: z.string().describe('Stock ticker symbol (e.g., TSLA)'),
  }),
  outputSchema: z.object({
    symbol: z.string(),
    price: z.number(),
    currency: z.string(),
    shortName: z.string(),
    marketState: z.string(),
  }),
  execute: async ({ context }) => {
    return await getQuote(context.symbol);
  },
});

// Summary Tool
export const yahooSummaryTool = createTool({
  id: 'get-yahoo-summary',
  description: 'Get detailed company summary and financial data from Yahoo Finance',
  inputSchema: z.object({
    symbol: z.string().describe('Stock ticker symbol (e.g., TSLA)'),
  }),
  outputSchema: z.object({
    summaryProfile: z.object({
      sector: z.string(),
      industry: z.string(),
      fullTimeEmployees: z.number(),
      longBusinessSummary: z.string(),
      country: z.string(),
      website: z.string(),
    }),
    financialData: z.object({
      currentPrice: z.number(),
      targetHighPrice: z.number().nullable(),
      targetLowPrice: z.number().nullable(),
      targetMeanPrice: z.number().nullable(),
      targetMedianPrice: z.number().nullable(),
      recommendationMean: z.number().nullable(),
      recommendationKey: z.string().nullable(),
      numberOfAnalystOpinions: z.number().nullable(),
      totalCash: z.number().nullable(),
      totalDebt: z.number().nullable(),
      totalRevenue: z.number().nullable(),
      revenueGrowth: z.number().nullable(),
      revenuePerShare: z.number().nullable(),
      returnOnEquity: z.number().nullable(),
      profitMargins: z.number().nullable(),
    }),
  }),
  execute: async ({ context }) => {
    return await getSummary(context.symbol);
  },
});

// Historical Data Tool
export const yahooHistoricalTool = createTool({
  id: 'get-yahoo-historical',
  description: 'Get historical stock price data from Yahoo Finance',
  inputSchema: z.object({
    symbol: z.string().describe('Stock ticker symbol (e.g., TSLA)'),
    period: z.string().optional().describe('Time period (e.g., 1mo, 1y, 5y)'),
  }),
  outputSchema: z.array(z.object({
    date: z.string(),
    open: z.number(),
    high: z.number(),
    low: z.number(),
    close: z.number(),
    volume: z.number(),
  })),
  execute: async ({ context }) => {
    return await getHistoricalPrices(context.symbol, context.period);
  },
});

// Helper functions
const getQuote = async (symbol: string) => {
  console.log(`[Yahoo Finance Tool] Fetching quote for symbol: ${symbol}`);
  
  try {
    const result = await yahooFinance.quote(symbol);
    console.log(`[Yahoo Finance Tool] Received quote for ${symbol}:`, {
      price: result.regularMarketPrice,
      currency: result.currency,
    });
    
    return {
      symbol: result.symbol || symbol,
      price: result.regularMarketPrice || 0,
      currency: result.currency || 'USD',
      shortName: result.shortName || symbol,
      marketState: result.marketState || 'REGULAR',
    };
  } catch (error) {
    console.error(`[Yahoo Finance Tool] Error fetching quote for ${symbol}:`, error);
    throw new Error(`Unable to fetch stock quote for ${symbol}`);
  }
};

const getSummary = async (symbol: string) => {
  console.log(`[Yahoo Finance Tool] Fetching summary for symbol: ${symbol}`);
  
  try {
    const result = await yahooFinance.quoteSummary(symbol, {
      modules: ['summaryProfile', 'financialData'],
    });
    
    console.log(`[Yahoo Finance Tool] Received summary for ${symbol}:`, {
      sector: result.summaryProfile?.sector,
      industry: result.summaryProfile?.industry,
      currentPrice: result.financialData?.currentPrice,
    });
    
    return {
      summaryProfile: {
        sector: result.summaryProfile?.sector || '',
        industry: result.summaryProfile?.industry || '',
        fullTimeEmployees: result.summaryProfile?.fullTimeEmployees || 0,
        longBusinessSummary: result.summaryProfile?.longBusinessSummary || '',
        country: result.summaryProfile?.country || '',
        website: result.summaryProfile?.website || '',
      },
      financialData: {
        currentPrice: result.financialData?.currentPrice || 0,
        targetHighPrice: result.financialData?.targetHighPrice || null,
        targetLowPrice: result.financialData?.targetLowPrice || null,
        targetMeanPrice: result.financialData?.targetMeanPrice || null,
        targetMedianPrice: result.financialData?.targetMedianPrice || null,
        recommendationMean: result.financialData?.recommendationMean || null,
        recommendationKey: result.financialData?.recommendationKey || null,
        numberOfAnalystOpinions: result.financialData?.numberOfAnalystOpinions || null,
        totalCash: result.financialData?.totalCash || null,
        totalDebt: result.financialData?.totalDebt || null,
        totalRevenue: result.financialData?.totalRevenue || null,
        revenueGrowth: result.financialData?.revenueGrowth || null,
        revenuePerShare: result.financialData?.revenuePerShare || null,
        returnOnEquity: result.financialData?.returnOnEquity || null,
        profitMargins: result.financialData?.profitMargins || null,
      },
    };
  } catch (error) {
    console.error(`[Yahoo Finance Tool] Error fetching summary for ${symbol}:`, error);
    throw new Error(`Unable to fetch stock summary for ${symbol}`);
  }
};

const getHistoricalPrices = async (symbol: string, period = '1mo') => {
  console.log(`[Yahoo Finance Tool] Fetching historical data for ${symbol} (period: ${period})`);
  
  try {
    const result = await yahooFinance.historical(symbol, {
      period1: period,
    });
    
    console.log(`[Yahoo Finance Tool] Received historical data for ${symbol}:`, {
      dataPoints: result.length,
      dateRange: `${result[0]?.date} to ${result[result.length - 1]?.date}`,
    });
    
    return result.map((item: any) => ({
      date: item.date.toISOString(),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));
  } catch (error) {
    console.error(`[Yahoo Finance Tool] Error fetching historical data for ${symbol}:`, error);
    throw new Error(`Unable to fetch historical data for ${symbol}`);
  }
}; 