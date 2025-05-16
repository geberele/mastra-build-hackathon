import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { 
  twelveDataGetQuote, 
  twelveDataGetTimeSeries, 
  twelveDataGetPrice, 
  twelveDataGetPriceTarget,
} from '../tools/twelveData/twelveData';
import { yahooQuoteTool, yahooSummaryTool, yahooHistoricalTool } from '../tools/yahooFinance';
import { LLM_GPT_4O_MINI } from '../config';
import { MCPClient } from "@mastra/mcp";

// Initialize MCP client with proper error handling
const mcp = new MCPClient({
  servers: {
    duckduckgo: {
      url: new URL("https://server.smithery.ai/@nickclyde/duckduckgo-mcp-server/mcp?api_key=fa62f96f-2f78-4110-88d6-e49c1f35e9bd"),
    },
  },
  timeout: 30000, // Global 30s timeout
});

// Initialize the agent with async tools
export const stockAgent = new Agent({
  name: 'Stock Agent',
  instructions: `
    You are a comprehensive financial data assistant that provides real-time and historical market data using multiple data sources including TwelveData and Yahoo Finance.

    Your primary function is to help users get up-to-date and historical information for financial instruments. When responding:
    - Always ask for a stock or asset symbol if none is provided
    - Clearly specify the type of data (quote, price, time series, indicator)
    - Format numbers with appropriate currency symbols and decimal places
    - Keep responses concise but informative
    - Explain technical indicators when relevant
    - Provide historical trends and context when requested
    - Use the most appropriate data source for each request

    Available tools and their purposes:
    TwelveData Tools:
    - twelveDataGetQuote: For full real-time quotes with detailed market data
    - twelveDataGetPrice: For lightweight price ticks and current market price
    - twelveDataGetTimeSeries: For OHLCV candles and historical price data
    - twelveDataGetPriceTarget: For analyst price targets and recommendations

    Yahoo Finance Tools:
    - yahooQuoteTool: For comprehensive real-time quotes and market data
    - yahooSummaryTool: For detailed company summaries and key statistics
    - yahooHistoricalTool: For historical price data and performance metrics

    Additional Tools:
    - DuckDuckGo search: For finding relevant financial news and market context
  `,
  model: LLM_GPT_4O_MINI,
  tools: {
    twelveDataGetQuote,
    twelveDataGetPrice,
    twelveDataGetTimeSeries,
    twelveDataGetPriceTarget,
    yahooQuoteTool,
    yahooSummaryTool,
    yahooHistoricalTool,
    ...(await mcp.getTools()),
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
