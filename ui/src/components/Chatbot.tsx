'use client';

import { useChat } from 'ai/react';
import { UIMessage } from 'ai';
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  Spacer,
} from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/avatar';

const Chatbot = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: 'http://localhost:4111/api/agents/twelveDataAgent/stream',
  });

  console.log(messages);

  return (
    <Flex
      direction="column"
      h="100vh"
      w="800px"
      mx="auto"
      bg="gray.50"
      borderRadius="lg"
      boxShadow="md"
      overflow="hidden"
      className="chatbot"
    >
      <Box flex="1" p={4} overflowY="auto">
        <VStack spacing={4} align="stretch">
          {messages.map((msg: UIMessage) => (
            <Flex
              key={msg.id}
              align="flex-end"
              justify={msg.role === "user" ? "flex-start" : "flex-end"}
            >
              {msg.role === "user" && (
                <Avatar
                  w="20px"
                  h="20px"
                  name="User" 
                  src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-person-128.png" 
                  mr={2}
                />
              )}
              {msg.role === "assistant" && (
                <Avatar
                  w="20px"
                  h="20px"
                  name="Assistant"
                  src="https://cdn2.iconfinder.com/data/icons/boxicons-solid-vol-1/24/bxs-bot-128.png"  
                />
              )}
              <Box>
                <Box
                  bg={msg.role === "user" ? "purple.100" : "green.100"}
                  color="black"
                  px={4}
                  py={2}
                  borderRadius="lg"
                  borderBottomLeftRadius={msg.role === "user" ? "0" : "lg"}
                  borderBottomRightRadius={msg.role === "user" ? "lg" : "0"}
                  maxW="250px"
                  whiteSpace="pre-line"
                >
                  {msg.content}
                </Box>
                <HStack spacing={2} mt={1}>
                  <Text fontSize="xs" color="gray.500">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : ""}
                  </Text>
                  <Text fontSize="xs" color="green.500">
                    {msg.delivered && "Delivered"}
                  </Text>
                </HStack>
              </Box>
              {msg.role === "assistant" && <Spacer />}
            </Flex>
          ))}
        </VStack>
      </Box>
      <Box p={4} borderTop="1px solid" borderColor="gray.200" bg="white">
        <Flex>
          <Input
            placeholder="Please type your reply here"
            value={input}
            onChange={handleInputChange}
            mr={2}
            bg="gray.100"
          />
          <Button colorScheme="green" onClick={handleSubmit}>Send</Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export { Chatbot };
