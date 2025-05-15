'use client';

import { useChat } from 'ai/react';
import { UIMessage } from 'ai';

const Chatbot = () => {


  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: 'http://localhost:4111/api/agents/twelveDataAgent/stream',
  });

  return <div>
    <div>
      {messages.map((message: UIMessage) => (
        <div key={message.id}>{message.content}</div>
      ))}
    </div>
    <input value={input} onChange={handleInputChange} />
    <button onClick={handleSubmit}>Send</button>
  </div>;
};

export { Chatbot };
