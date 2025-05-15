/**
 * Twelve Data Tools
 *
 * This module provides a set of tools for accessing real-time and analytical financial data
 * from the Twelve Data API. The tools cover a wide range of endpoints, including:
 *
 * - Market quotes and real-time prices
 * - Historical OHLCV time series data
 * - Technical indicators (SMA, RSI, EMA, etc.)
 * - Analyst earnings and revenue estimates
 * - EPS trends, recommendations, price targets, and analyst ratings
 *
 * Each tool is designed for a specific endpoint and exposes a clear input schema for querying
 * financial data for stocks, forex, ETFs, and cryptocurrencies. These tools are intended for use
 * in financial analysis, trading assistants, and market research applications.
 *
 * For more details, see: https://twelvedata.com/docs#analysis
 */
import { createTool } from "@mastra/core/tools";
import axios from "axios";
import { z } from "zod";

const td = axios.create({
  baseURL: "https://api.twelvedata.com",
  params: { apikey: process.env.TWELVE_DATA_API_KEY },
});

/** Quote: full snapshot */
export const twelveDataGetQuote = createTool({
  id: "get_quote",
  description: "Retrieve the latest full market quote for a given symbol, including price, volume, and other key metrics.",
  inputSchema: z.object({ symbol: z.string() }),
  execute: async ({ context: { symbol } }) => {
    const { data } = await td.get("/quote", { params: { symbol } });
    return data;
  },
});

/** Price: just the real-time price */
export const twelveDataGetPrice = createTool({
  id: "get_price",
  description: "Fetch the real-time price tick for a given symbol. Lightweight and fast for current price checks.",
  inputSchema: z.object({ symbol: z.string() }),
  execute: async ({ context: { symbol } }) =>
    (await td.get("/price", { params: { symbol } })).data,
});

/** OHLC candles */
export const twelveDataGetTimeSeries = createTool({
  id: "get_time_series",
  description: "Get historical OHLCV (Open, High, Low, Close, Volume) candle data for a symbol over a specified interval.",
  inputSchema: z.object({
    symbol: z.string(),
    interval: z.string().default("1day"),
    outputsize: z.number().int().min(1).max(5000).default(30),
  }),
  execute: async ({ context }) =>
    (await td.get("/time_series", { params: context })).data,
});

/** Technical indicator (e.g., SMA) */
export const twelveDataGetIndicator = createTool({
  id: "get_indicator",
  description: "Calculate technical indicators (SMA, RSI, EMA) for a symbol and interval, useful for market analysis.",
  inputSchema: z.object({
    symbol: z.string(),
    indicator: z.enum(["sma", "rsi", "ema"]),
    interval: z.string().default("1day"),
    time_period: z.number().int().default(50),
  }),
  execute: async ({ context }) =>
    (await td.get(`/${context.indicator}`, { params: context })).data,
});

/** Earnings Estimate */
export const twelveDataGetEarningsEstimate = createTool({
  id: "get_earnings_estimate",
  description: "Get analyst earnings estimates for a symbol, including expected EPS for upcoming periods.",
  inputSchema: z.object({ symbol: z.string() }),
  execute: async ({ context: { symbol } }) =>
    (await td.get("/earnings_estimate", { params: { symbol } })).data,
});

/** Revenue Estimate */
export const twelveDataGetRevenueEstimate = createTool({
  id: "get_revenue_estimate",
  description: "Retrieve revenue estimates for a symbol, showing projected company revenues by analysts.",
  inputSchema: z.object({ symbol: z.string() }),
  execute: async ({ context: { symbol } }) =>
    (await td.get("/revenue_estimate", { params: { symbol } })).data,
});

/** EPS Trend */
export const twelveDataGetEpsTrend = createTool({
  id: "get_eps_trend",
  description: "Track the EPS (Earnings Per Share) trend for a symbol, including historical and forecasted values.",
  inputSchema: z.object({ symbol: z.string() }),
  execute: async ({ context: { symbol } }) =>
    (await td.get("/eps_trend", { params: { symbol } })).data,
});

/** Recommendations */
export const twelveDataGetRecommendations = createTool({
  id: "get_recommendations",
  description: "Get analyst recommendations for a symbol, such as buy, hold, or sell ratings.",
  inputSchema: z.object({ symbol: z.string() }),
  execute: async ({ context: { symbol } }) =>
    (await td.get("/recommendations", { params: { symbol } })).data,
});

/** Price Target */
export const twelveDataGetPriceTarget = createTool({
  id: "get_price_target",
  description: "Fetch the latest analyst price targets for a symbol, including high, low, and average targets.",
  inputSchema: z.object({ symbol: z.string() }),
  execute: async ({ context: { symbol } }) =>
    (await td.get("/price_target", { params: { symbol } })).data,
});

/** Analyst Ratings */
export const twelveDataGetAnalystRatings = createTool({
  id: "get_analyst_ratings",
  description: "Retrieve detailed analyst ratings for a symbol, summarizing market sentiment and analyst opinions.",
  inputSchema: z.object({ symbol: z.string() }),
  execute: async ({ context: { symbol } }) =>
    (await td.get("/analyst_ratings", { params: { symbol } })).data,
});
