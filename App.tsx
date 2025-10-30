
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Message } from './types';
import { startChat, sendMessage } from './services/geminiService';
import type { Chat } from '@google/genai';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';

// FIX: Add minimal SpeechRecognition types to fix TypeScript errors. This is necessary because the Web Speech API is not yet in the standard TS DOM library.
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: { results: any }) => void;
  onerror: (event: { error: any }) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);


  const initialMessage: Message = {
    id: 'initial-message',
    role: 'model',
    text: "Hello! I'm a chat bot powered by Gemini hanif. How can I help you today?",
  };

  useEffect(() => {
    try {
      chatRef.current = startChat();
      setMessages([initialMessage]);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Failed to initialize chat: ${e.message}`);
      } else {
        setError('An unknown error occurred during chat initialization.');
      }
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setError(`Speech recognition error: ${event.error}`);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition API is not supported in this browser.");
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: input.trim(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const responseText = await sendMessage(chatRef.current, userMessage.text);
      const botMessage: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: responseText,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get response: ${errorMessage}`);
      const errorBotMessage: Message = {
          id: `model-error-${Date.now()}`,
          role: 'model',
          text: `Sorry, I encountered an error: ${errorMessage}`,
      }
      setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);
  
  const handleClearChat = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the entire chat history? This action cannot be undone.')) {
        setMessages([initialMessage]);
        setError(null);
    }
  }, []);

  const handleToggleListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setError("Speech recognition is not supported by your browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      setInput('');
      recognition.start();
    }
  }, [isListening]);


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <Header onClear={handleClearChat} />
      <ChatHistory messages={messages} isLoading={isLoading} />
      {error && (
        <div className="px-4 py-2 text-red-400 bg-red-900/50 text-center text-sm">
          {error}
        </div>
      )}
      <ChatInput
        input={input}
        onInputChange={(e) => setInput(e.target.value)}
        onSend={handleSend}
        isLoading={isLoading}
        isListening={isListening}
        onToggleListening={handleToggleListening}
      />
    </div>
  );
};

export default App;