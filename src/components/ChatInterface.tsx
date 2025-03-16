
import React, { useState, useRef, useEffect } from 'react';
import { useTravelContext } from '../context/TravelContext';
import { Send, Loader2, MapPin, DollarSign, Users, Compass, Brain, LightbulbIcon } from 'lucide-react';

const ChatInterface = () => {
  const {
    submitTravelQuery,
    travelResponse,
    isQuerying,
    clearResponse
  } = useTravelContext();
  
  const [message, setMessage] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [chatHistory, setChatHistory] = useState<{
    sender: 'user' | 'assistant';
    message: string;
    timestamp: Date;
    isThinking?: boolean;
    isReasoning?: boolean;
  }[]>([
    {
      sender: 'assistant',
      message: "Hello! I'm your Dominican Republic travel assistant powered by OpenAI reasoning technology. What kind of trip are you planning? You can ask me for recommendations on beaches, activities, or specific regions like Punta Cana or Santo Domingo.",
      timestamp: new Date(),
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory((prev) => [
      ...prev,
      {
        sender: 'user',
        message: message.trim(),
        timestamp: new Date(),
      },
    ]);
    
    // Add reasoning indicator
    setChatHistory((prev) => [
      ...prev,
      {
        sender: 'assistant',
        message: "Applying deep reasoning to research your travel query...",
        timestamp: new Date(),
        isReasoning: true,
      },
    ]);
    
    // Submit query to get response
    submitTravelQuery(message.trim());
    
    // Clear input
    setMessage('');
  };

  // Scroll to bottom when chat updates
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Replace thinking message with response when travelResponse changes
  useEffect(() => {
    if (travelResponse && !isQuerying) {
      setChatHistory((prev) => {
        // Remove the last message if it was a reasoning message
        const newHistory = [...prev];
        if (newHistory.length > 0 && (newHistory[newHistory.length - 1].isThinking || newHistory[newHistory.length - 1].isReasoning)) {
          newHistory.pop();
        }
        
        // Add the actual response
        return [
          ...newHistory,
          {
            sender: 'assistant',
            message: travelResponse.summary,
            timestamp: new Date(),
          },
        ];
      });
    }
  }, [travelResponse, isQuerying]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Suggestion chips
  const suggestions = [
    { icon: <MapPin className="w-3 h-3" />, text: "Best beaches in Punta Cana" },
    { icon: <DollarSign className="w-3 h-3" />, text: "Budget-friendly activities" },
    { icon: <Users className="w-3 h-3" />, text: "Family-friendly resorts" },
    { icon: <Compass className="w-3 h-3" />, text: "Hidden gems in Samaná" },
    { icon: <Brain className="w-3 h-3" />, text: "Plan my week-long vacation" },
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    // Focus on input after selecting suggestion
    inputRef.current?.focus();
  };

  return (
    <div id="assistant" className="container mx-auto px-6 md:px-8 py-20">
      <div className="text-center mb-12">
        <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mb-4">
          OpenAI o3-mini Reasoning Technology
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Your Personal Travel Planner
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Ask anything about traveling to the Dominican Republic and get instant, research-backed recommendations tailored to your preferences using OpenAI's advanced reasoning capabilities.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-glass overflow-hidden border border-gray-100">
          {/* Chat messages */}
          <div className="h-96 overflow-y-auto p-6 flex flex-col gap-4">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    chat.sender === 'user'
                      ? 'bg-ocean-500 text-white rounded-tr-none'
                      : chat.isReasoning
                      ? 'bg-purple-100 text-purple-800 rounded-tl-none'
                      : chat.isThinking
                      ? 'bg-blue-100 text-blue-800 rounded-tl-none'
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {chat.isReasoning ? (
                    <div className="flex items-center gap-2">
                      <LightbulbIcon className="w-4 h-4 text-purple-500" />
                      <p>{chat.message}</p>
                    </div>
                  ) : chat.isThinking ? (
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-500" />
                      <p>{chat.message}</p>
                    </div>
                  ) : (
                    <p>{chat.message}</p>
                  )}
                  <div
                    className={`text-xs mt-1 ${
                      chat.sender === 'user' 
                        ? 'text-white/70' 
                        : chat.isReasoning
                        ? 'text-purple-500'
                        : chat.isThinking
                        ? 'text-blue-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {chat.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isQuerying && !chatHistory.some(chat => chat.isThinking || chat.isReasoning) && (
              <div className="flex justify-start">
                <div className="bg-purple-100 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                  <span className="text-purple-800">Applying advanced reasoning to find the best travel options...</span>
                </div>
              </div>
            )}
            
            <div ref={messageEndRef} />
          </div>
          
          {/* Suggestion chips */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto hide-scrollbar">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="flex items-center gap-1 whitespace-nowrap px-3 py-1.5 bg-white rounded-full text-xs border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-colors"
                onClick={() => handleSuggestionClick(suggestion.text)}
              >
                {suggestion.icon}
                <span>{suggestion.text}</span>
              </button>
            ))}
          </div>
          
          {/* Input form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about your Dominican Republic trip..."
              className="flex-1 rounded-full px-4 py-2 bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isQuerying}
            />
            <button
              type="submit"
              className="rounded-full w-10 h-10 flex items-center justify-center bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!message.trim() || isQuerying}
            >
              {isQuerying ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
