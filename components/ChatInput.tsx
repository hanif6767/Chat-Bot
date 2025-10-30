
import React from 'react';
import { SendIcon, MicrophoneIcon } from './Icons';

interface ChatInputProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  isLoading: boolean;
  isListening: boolean;
  onToggleListening: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ input, onInputChange, onSend, isLoading, isListening, onToggleListening }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <footer className="bg-gray-800/70 backdrop-blur-sm p-4 sticky bottom-0">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center bg-gray-700 rounded-lg p-2">
          <textarea
            value={input}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Type your message..."}
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none placeholder-gray-400 text-gray-100 px-2"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={onToggleListening}
            disabled={isLoading}
            className={`p-2 rounded-full text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${isListening ? 'bg-red-500/50 animate-pulse' : ''}`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
            title={isListening ? 'Stop listening' : 'Start listening'}
          >
            <MicrophoneIcon />
          </button>
          <button
            onClick={onSend}
            disabled={isLoading || !input.trim()}
            className="p-2 ml-2 rounded-full bg-cyan-600 text-white hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default ChatInput;