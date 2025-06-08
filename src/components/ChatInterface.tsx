
import React, { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw, ShoppingCart, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from './ProductCard';
import { MessageBubble } from './MessageBubble';
import { FilterPanel } from './FilterPanel';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  products?: Product[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  description: string;
  inStock: boolean;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    category: 'Electronics',
    image: '/placeholder.svg',
    rating: 4.5,
    description: 'High-quality wireless headphones with noise cancellation',
    inStock: true
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    category: 'Electronics',
    image: '/placeholder.svg',
    rating: 4.8,
    description: 'Feature-rich smartwatch with health monitoring',
    inStock: true
  },
  {
    id: '3',
    name: 'USB-C Cable',
    price: 12.99,
    category: 'Accessories',
    image: '/placeholder.svg',
    rating: 4.2,
    description: 'Durable USB-C charging cable',
    inStock: false
  },
  {
    id: '4',
    name: 'Laptop Stand',
    price: 45.99,
    category: 'Accessories',
    image: '/placeholder.svg',
    rating: 4.6,
    description: 'Adjustable aluminum laptop stand',
    inStock: true
  }
];

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your personal shopping assistant. How can I help you find the perfect product today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: '',
    inStock: false
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const searchProducts = (query: string): Product[] => {
    return mockProducts.filter(product => {
      const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
                          product.description.toLowerCase().includes(query.toLowerCase()) ||
                          product.category.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = filters.category === 'all' || product.category === filters.category;
      const matchesMinPrice = !filters.minPrice || product.price >= parseFloat(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || product.price <= parseFloat(filters.maxPrice);
      const matchesStock = !filters.inStock || product.inStock;

      return matchesQuery && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesStock;
    });
  };

  const generateBotResponse = (userMessage: string): { text: string; products?: Product[] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return { text: "Hello! I'm here to help you find amazing products. What are you looking for today?" };
    }
    
    if (lowerMessage.includes('help')) {
      return { 
        text: "I can help you:\n• Search for products\n• Filter by category, price, or availability\n• Get product recommendations\n• Answer questions about our products\n\nJust tell me what you're looking for!" 
      };
    }

    // Search for products
    const products = searchProducts(userMessage);
    
    if (products.length > 0) {
      return {
        text: `I found ${products.length} product${products.length > 1 ? 's' : ''} matching your search. Take a look:`,
        products
      };
    } else {
      return { 
        text: "I couldn't find any products matching your search. Try different keywords or check our categories: Electronics, Accessories. Would you like me to show you our popular items instead?" 
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateBotResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        products: response.products
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const resetConversation = () => {
    setMessages([
      {
        id: '1',
        text: "Hello! I'm your personal shopping assistant. How can I help you find the perfect product today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Shopping Assistant</h1>
              <p className="text-sm text-gray-600">Your AI-powered shopping companion</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetConversation}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 max-w-4xl mx-auto w-full">
        {/* Filter Panel */}
        {showFilters && (
          <FilterPanel 
            filters={filters} 
            setFilters={setFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <MessageBubble message={message} />
                {message.products && message.products.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {message.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-4 shadow-sm border max-w-xs">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-200">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about products, search, or get recommendations..."
                  className="pr-12 rounded-2xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
