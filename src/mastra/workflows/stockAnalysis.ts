import { Workflow } from '@mastra/core/workflows';
import { stockAgent } from '../agents/stock';
import { yahooQuoteTool, yahooSummaryTool, yahooHistoricalTool } from '../tools/yahoo';

export const stockAnalysisWorkflow = new Workflow({
  name: 'Stock Analysis Workflow',
  description: 'Analyzes stocks using real-time data, company information, and historical trends',
  agents: [stockAgent],
  tools: {
    yahooQuoteTool,
    yahooSummaryTool,
    yahooHistoricalTool,
  },
  steps: [
    {
      id: 'Get Real-Time Quote',
      description: 'Fetches current stock price and market status',
      tool: yahooQuoteTool,
      input: {
        symbol: '{{input.symbol}}',
      },
    },
    {
      id: 'Get Company Overview',
      description: 'Retrieves company profile and financial metrics',
      tool: yahooSummaryTool,
      input: {
        symbol: '{{input.symbol}}',
      },
    },
    {
      id: 'Get Historical Data',
      description: 'Fetches historical price data for trend analysis',
      tool: yahooHistoricalTool,
      input: {
        symbol: '{{input.symbol}}',
        period: '{{input.period || "1mo"}}',
      },
    },
    {
      id: 'Analyze Data',
      description: 'Uses the stock agent to analyze and summarize the data',
      agent: stockAgent,
      input: {
        quote: '{{steps.Get Real-Time Quote.output}}',
        summary: '{{steps.Get Company Overview.output}}',
        history: '{{steps.Get Historical Data.output}}',
      },
    },
  ],
}); 