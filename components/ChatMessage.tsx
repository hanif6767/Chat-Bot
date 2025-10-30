
import React from 'react';
import type { Message } from '../types';
import { BotIcon, UserIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUserModel = message.role === 'model';

  return (
    <div className={`flex items-start gap-3 ${!isUserModel ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isUserModel ? 'bg-gray-700' : 'bg-cyan-600'}`}>
        {isUserModel ? <BotIcon /> : <UserIcon />}
      </div>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-lg px-4 py-2 ${
          isUserModel ? 'bg-gray-700' : 'bg-cyan-800'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
