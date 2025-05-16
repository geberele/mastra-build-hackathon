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
  chakra,
} from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/avatar';
import Markdown from 'react-markdown'
import { Quote } from './Quote';

const Chatbot = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: 'http://localhost:4111/api/agents/twelveDataAgent/stream',
  });

  console.log(messages);

  return (
    <Flex
      direction="column"
      h="95vh"
      w="800px"
      mx="auto"
      bg="gray.50"
      borderRadius="lg"
      boxShadow="md"
      overflow="hidden"
      className="chatbot"
    >
      <Box flex="1" p={4} overflowY="auto">
        <VStack align="stretch">
          {messages.map((msg: UIMessage) => (
            <Flex
              key={msg.id}
              align="flex-end"
              justify={msg.role === "user" ? "flex-end" : "flex-start"}
            >
              {msg.role === "assistant" && (
                <Avatar
                  w="20px"
                  h="20px"
                  name="Assistant"
                  src="https://cdn2.iconfinder.com/data/icons/boxicons-solid-vol-1/24/bxs-bot-128.png"
                  mr={4}
                />
              )}
              <Box>
              {msg.toolInvocations &&
                msg.toolInvocations.map((toolInvocation) => {
                  if (
                    toolInvocation.toolName === 'getQuote' &&
                    toolInvocation.state === 'result' &&
                    'result' in toolInvocation
                  ) {
                    const data = toolInvocation.result;
                    return <Quote key={toolInvocation.toolCallId} data={data} />;
                  }
                  return null;
                })}
                <Box
                  bg={msg.role === "user" ? "purple.100" : "green.100"}
                  color="black"
                  px={4}
                  py={2}
                  borderRadius="lg"
                  borderBottomLeftRadius={msg.role === "user" ? "lg" : "0"}
                  borderBottomRightRadius={msg.role === "user" ? "0" : "lg"}
                  maxW="500px"
                  whiteSpace="pre-line"
                >
                  <Markdown>{msg.content}</Markdown>
                </Box>
                <HStack gap={2} justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}>
                  <Text fontSize="xs" color="gray.500">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : ""}
                  </Text>
                </HStack>
              </Box>
              {msg.role === "user" && (
                <Avatar
                  w="20px"
                  h="20px"
                  name="User"
                  src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-person-128.png"
                  ml={4}
                />
              )}
            </Flex>
          ))}
        </VStack>
      </Box>
      <Box p={4} borderTop="1px solid" borderColor="gray.200" bg="white">
        <chakra.form onSubmit={handleSubmit}>
          <Flex>
            <Input
              placeholder="Please type your reply here"
              value={input}
              onChange={handleInputChange}
              mr={2}
              bg="gray.100"
            />
            <Button colorScheme="green" type="submit">Send</Button>
          </Flex>
        </chakra.form>
      </Box>
    </Flex>
  );
};

export { Chatbot };
