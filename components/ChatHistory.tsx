import React, { useRef, useEffect } from 'react';
import type { Message } from '../types';
import ChatMessage from './ChatMessage';
import { BotIcon } from './Icons';

interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-700">
      <BotIcon />
    </div>
    <div className="bg-gray-700 rounded-lg px-4 py-2 flex items-center justify-center gap-1.5 h-[36px]">
        <div
          className="w-1.5 h-4 bg-cyan-400 rounded-full origin-bottom"
          style={{ animation: 'wave 1.2s ease-in-out infinite', animationDelay: '-0.4s' }}
        ></div>
        <div
          className="w-1.5 h-4 bg-cyan-400 rounded-full origin-bottom"
          style={{ animation: 'wave 1.2s ease-in-out infinite', animationDelay: '-0.2s' }}
        ></div>
        <div
          className="w-1.5 h-4 bg-cyan-400 rounded-full origin-bottom"
          style={{ animation: 'wave 1.2s ease-in-out infinite' }}
        ></div>
        <div
          className="w-1.5 h-4 bg-cyan-400 rounded-full origin-bottom"
          style={{ animation: 'wave 1.2s ease-in-out infinite', animationDelay: '0.2s' }}
        ></div>
         <div
          className="w-1.5 h-4 bg-cyan-400 rounded-full origin-bottom"
          style={{ animation: 'wave 1.2s ease-in-out infinite', animationDelay: '0.4s' }}
        ></div>
    </div>
  </div>
);


const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <main className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={endOfMessagesRef} />
    </main>
  );
};

export default ChatHistory;