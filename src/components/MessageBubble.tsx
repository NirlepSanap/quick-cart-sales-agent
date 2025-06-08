
import React from 'react';
import { format } from 'date-fns';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isUser ? 'order-1' : 'order-2'}`}>
        <div
          className={`rounded-2xl p-4 shadow-sm border ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-4'
              : 'bg-white text-gray-900 mr-4'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
        </div>
        <div className={`text-xs text-gray-500 mt-1 px-3 ${isUser ? 'text-right' : 'text-left'}`}>
          {format(message.timestamp, 'HH:mm')}
        </div>
      </div>
      
      {!isUser && (
        <div className="order-1 mr-3 mt-1">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            AI
          </div>
        </div>
      )}
      
      {isUser && (
        <div className="order-2 ml-3 mt-1">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold">
            U
          </div>
        </div>
      )}
    </div>
  );
};
