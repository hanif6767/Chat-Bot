
import React from 'react';
import { ClearIcon } from './Icons';

interface HeaderProps {
  onClear: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClear }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-md z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="w-8"></div> {/* Spacer to center title */}
        <h1 className="text-xl font-bold text-center text-cyan-400">
          IA&C Chat Bot
        </h1>
        <button
          onClick={onClear}
          className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          aria-label="Clear chat history"
          title="Clear chat"
        >
          <ClearIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;