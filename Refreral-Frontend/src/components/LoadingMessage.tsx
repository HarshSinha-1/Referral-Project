import React from 'react';
import { Bot } from 'lucide-react';

interface LoadingMessageProps {
  isDarkMode: boolean;
}

export const LoadingMessage: React.FC<LoadingMessageProps> = ({ isDarkMode }) => {
  const themeClasses = {
    text: isDarkMode ? 'text-[#e4e4e4]' : 'text-gray-900',
    secondaryText: isDarkMode ? 'text-[#a6adc8]' : 'text-gray-600',
    messageBot: isDarkMode ? 'bg-transparent text-[#e4e4e4]' : 'bg-transparent text-gray-900',
  };

  return (
    <div className="flex justify-start mb-4">
      <div className="flex flex-row space-x-3 max-w-3xl">
        <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
        <div className="flex-1 ml-3">
          <div className="flex items-center space-x-2 mb-1 justify-start">
            <span className={`font-medium text-sm ${themeClasses.text}`}>Response</span>
            <span className={`text-xs ${themeClasses.secondaryText}`}>typing...</span>
          </div>
          <div className={`${themeClasses.messageBot} p-3 rounded-lg rounded-bl-sm`}>
            <div className="flex space-x-1">
              <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`}></div>
              <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
              <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};