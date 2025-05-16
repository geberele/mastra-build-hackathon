import { Box, Text } from '@chakra-ui/react';

export interface QuoteData {
  name: string;
  symbol: string;
  close: string;
  currency: string;
  change: string;
  percent_change: string;
  open: string;
  high: string;
  low: string;
  previous_close: string;
  volume: string;
  average_volume: string;
  fifty_two_week?: {
    high: string;
    low: string;
  };
  exchange: string;
  mic_code: string;
  datetime: string;
  is_market_open: boolean;
}

export const Quote = ({ data }: { data: QuoteData }) => (
  <Box
    bg="gray.100"
    borderRadius="md"
    p={3}
    mb={2}
    fontSize="sm"
    boxShadow="sm"
    maxW="400px"
  >
    <Text fontWeight="bold" fontSize="md" mb={1}>{data.name} ({data.symbol})</Text>
    <Text><b>Current Price:</b> {data.close} {data.currency}</Text>
    <Text><b>Change:</b> {data.change} ({parseFloat(data.percent_change).toFixed(2)}%)</Text>
    <Text><b>Open:</b> {data.open} &nbsp; <b>High:</b> {data.high} &nbsp; <b>Low:</b> {data.low}</Text>
    <Text><b>Previous Close:</b> {data.previous_close}</Text>
    <Text><b>Volume:</b> {data.volume} &nbsp; <b>Avg Volume:</b> {data.average_volume}</Text>
    <Text><b>52W High:</b> {data.fifty_two_week?.high} &nbsp; <b>52W Low:</b> {data.fifty_two_week?.low}</Text>
    <Text><b>Exchange:</b> {data.exchange} ({data.mic_code})</Text>
    <Text><b>Date:</b> {data.datetime}</Text>
    <Text><b>Market Open:</b> {data.is_market_open ? "Yes" : "No"}</Text>
  </Box>
);
