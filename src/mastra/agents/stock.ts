import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { yahooQuoteTool, yahooSummaryTool, yahooHistoricalTool } from '../tools/yahoo';
import { LLM_GPT_4O_MINI } from '../config';

export const stockAgent = new Agent({
  name: 'Stock Market Agent',
  instructions: `
    You are a helpful stock market assistant that provides accurate stock information.

    Your primary function is to help users get stock details for specific companies. When responding:
    - Always ask for a stock symbol if none is provided
    - Format numbers with appropriate currency symbols and decimal places
    - Include relevant details like price, change, volume, and market cap
    - Keep responses concise but informative
    - Highlight significant changes or notable statistics
    - Provide company overview and financial metrics when relevant
    - Show historical price trends when requested

    Use the following tools to fetch stock data:
    - yahooQuoteTool: For real-time stock quotes
    - yahooSummaryTool: For company overview and financial data
    - yahooHistoricalTool: For historical price data
  `,
  model: LLM_GPT_4O_MINI,
  tools: {
    yahooQuoteTool,
    yahooSummaryTool,
    yahooHistoricalTool,
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