import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { BotIcon, SendIcon, UserIcon } from './icons';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-base-100 rounded-lg shadow-xl overflow-hidden">
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-4 max-w-xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`p-2 rounded-full ${msg.sender === 'user' ? 'bg-brand-secondary text-white' : 'bg-base-300 text-text-primary'}`}>
              {msg.sender === 'user' ? <UserIcon /> : <BotIcon />}
            </div>
            <div className={`px-4 py-3 rounded-xl ${msg.sender === 'user' ? 'bg-brand-secondary text-white' : 'bg-base-200 text-text-secondary'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-4 max-w-xl">
                 <div className="p-2 rounded-full bg-base-300 text-text-primary">
                    <BotIcon />
                 </div>
                <div className="px-4 py-3 rounded-xl bg-base-200 text-text-secondary">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-base-200 border-t border-base-300">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: Reunião com chefe amanhã às 18h..."
            className="flex-1 bg-base-300 border border-base-300 rounded-full py-3 px-5 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-brand-secondary text-white p-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary disabled:bg-base-300 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;