import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { 
  twelveDataGetQuote, 
  twelveDataGetIndicator, 
  twelveDataGetTimeSeries, 
  twelveDataGetPrice, 
  twelveDataGetEpsTrend, 
  twelveDataGetPriceTarget, 
  twelveDataGetEarningsEstimate,
  twelveDataGetRevenueEstimate,
  twelveDataGetRecommendations,
  twelveDataGetAnalystRatings,
} from '../tools/twelveData/twelveData';
import { LLM_GPT_4O_MINI } from '../config';

export const twelveDataAgent = new Agent({
  name: 'TwelveData Agent',
  instructions: `
    You are a helpful financial data assistant that provides real-time and historical market data using the TwelveData API.

    Your primary function is to help users get up-to-date and historical information for financial instruments. When responding:
    - Always ask for a stock or asset symbol if none is provided
    - Clearly specify the type of data (quote, price, time series, indicator)
    - Format numbers with appropriate currency symbols and decimal places
    - Keep responses concise but informative
    - Explain technical indicators when relevant
    - Provide historical trends and context when requested

    Use the following tools to fetch data:
    - twelveDataGetQuote: For full real-time quotes
    - twelveDataGetPrice: For lightweight price ticks
    - twelveDataGetTimeSeries: For OHLCV candles
    - twelveDataGetIndicator: For technical indicators (SMA, RSI, EMA)
  `,
  model: LLM_GPT_4O_MINI,
  tools: {
    twelveDataGetQuote,
    twelveDataGetPrice,
    twelveDataGetTimeSeries,
    twelveDataGetIndicator,
    twelveDataGetEarningsEstimate,
    twelveDataGetRevenueEstimate,
    twelveDataGetEpsTrend,
    twelveDataGetRecommendations,
    twelveDataGetPriceTarget,
    twelveDataGetAnalystRatings,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
    options: {
      lastMessages: 10,
      semanticRecall: false,
      threads: {
        generateTitle: false,
      },
    },
  }),
});
