import { Box, Text } from '@chakra-ui/react';

export interface PriceData {
  symbol: string;
  price: string;
  currency?: string;
}

export const Price = ({ data }: { data: PriceData }) => (
  <Box
    bg="gray.100"
    borderRadius="md"
    p={3}
    mb={2}
    fontSize="sm"
    boxShadow="sm"
    maxW="400px"
  >
    <Text fontWeight="bold" fontSize="md" mb={1}>{data.symbol}</Text>
    <Text><b>Current Price:</b> {data.price} {data.currency || ''}</Text>
  </Box>
); 