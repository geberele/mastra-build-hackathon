'use client';

import { useChat } from 'ai/react';
import { UIMessage } from 'ai';
import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Container,
} from '@chakra-ui/react';

const Chatbot = () => {


  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: 'http://localhost:4111/api/agents/twelveDataAgent/stream',
  });

  return (
    <Container p={4}>
      <div>
        {messages.map((message: UIMessage) => (
          <div key={message.id}>{message.content}</div>
        ))}
      </div>
      <input value={input} onChange={handleInputChange} />
      <button onClick={handleSubmit}>Send</button>
    </Container>
  );
};

export { Chatbot };
