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
  description: "Latest full quote for a symbol",
  inputSchema: z.object({ symbol: z.string() }),
  execute: async ({ context: { symbol } }) => {
    const { data } = await td.get("/quote", { params: { symbol } });
    return data;
  },
});

/** Price: just the real-time price */
export const twelveDataGetPrice = createTool({
  id: "get_price",
  description: "Light-weight price tick",
  inputSchema: z.object({ symbol: z.string() }),
  execute: async ({ context: { symbol } }) =>
    (await td.get("/price", { params: { symbol } })).data,
});

/** OHLC candles */
export const twelveDataGetTimeSeries = createTool({
  id: "get_time_series",
  description: "OHLCV candles",
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
  description: "Technical indicator such as SMA, RSI",
  inputSchema: z.object({
    symbol: z.string(),
    indicator: z.enum(["sma", "rsi", "ema"]),
    interval: z.string().default("1day"),
    time_period: z.number().int().default(50),
  }),
  execute: async ({ context }) =>
    (await td.get(`/${context.indicator}`, { params: context })).data,
});
