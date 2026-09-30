import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Trash2,
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';
import chatbotData from '../data/chatbot.json';

const CHAT_STORAGE_KEY = 'freshfind_chat_history_v1';
const WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'bot',
  text: "Hello! Welcome to FreshFind — Fresh All Along! 🌿 How can I help you discover fresh local farmers markets or seasonal produce today?",
  suggestions: chatbotData.quickSuggestions.slice(0, 3)
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not load chat history:', err);
    }
    return [WELCOME_MESSAGE];
  });

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Save messages to localStorage whenever conversation updates
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.warn('Could not persist chat history:', err);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Rule-based keyword matching algorithm
  const findBestAnswer = (userQuery) => {
    const cleanQuery = userQuery.toLowerCase().trim();
    if (!cleanQuery) return null;

    let bestMatch = null;
    let highestScore = 0;

    for (const item of chatbotData.faq) {
      let score = 0;

      // Check each keyword
      for (const kw of item.keywords) {
        const lowerKw = kw.toLowerCase();
        if (cleanQuery === lowerKw) {
          score += 10;
        } else if (cleanQuery.includes(lowerKw)) {
          score += 4;
        } else {
          // Check word-by-word token overlap
          const queryWords = cleanQuery.split(/\s+/);
          if (queryWords.includes(lowerKw)) {
            score += 3;
          }
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    if (highestScore > 0 && bestMatch) {
      return {
        text: bestMatch.answer,
        link: bestMatch.link,
        linkText: bestMatch.linkText,
        suggestions: chatbotData.quickSuggestions.slice(0, 2)
      };
    }

    // Default Fallback
    return {
      text: chatbotData.defaultResponse.answer,
      suggestions: chatbotData.defaultResponse.fallbackSuggestions
    };
  };

  const handleSendMessage = (textToSend = null) => {
    const query = typeof textToSend === 'string' ? textToSend : input;
    if (!query.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');

    // Simulate instant natural typing delay
    setTimeout(() => {
      const match = findBestAnswer(query);
      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: match.text,
        link: match.link,
        linkText: match.linkText,
        suggestions: match.suggestions
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    const resetMessage = [
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: "Conversation cleared. Feel free to ask about markets, open hours, or seasonal produce!",
        suggestions: chatbotData.quickSuggestions.slice(0, 3)
      }
    ];
    setMessages(resetMessage);
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(resetMessage));
    } catch (err) {
      console.warn('Could not reset chat storage:', err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="animate-float hover:[animation-play-state:paused]">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open FreshFind Rule-Based Chat Assistant"
            className="group relative flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-[#0b3b24] text-white rounded-full shadow-[0_8px_25px_-4px_rgba(5,150,105,0.45)] hover:shadow-[0_12px_32px_-2px_rgba(5,150,105,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-emerald-400/50"
          >
            {/* Soft Ambient Pulse Ring */}
            <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-pulse pointer-events-none" />

            <div className="relative">
              <MessageSquare className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white animate-pulse" />
            </div>
            <span className="font-extrabold text-xs sm:text-sm tracking-wide hidden sm:inline text-white drop-shadow-xs">
              Ask FreshFind
            </span>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="FreshFind Assistant Chat Window"
          className="w-[92vw] sm:w-[400px] h-[540px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-forest p-4 text-white flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-400/20 border border-emerald-300/40 flex items-center justify-center text-emerald-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight">FreshFind Guide</h3>
                  <span className="text-[10px] bg-emerald-400/20 text-emerald-200 font-semibold px-1.5 py-0.2 rounded border border-emerald-400/30">
                    Rule-Based
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80">Static dataset • No external AI</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                title="Clear conversation"
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Clear chat history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close chatbot window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-stone-50/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-none shadow-soft'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Direct internal link if available */}
                  {msg.link && (
                    <div className="mt-2.5 pt-2 border-t border-stone-100">
                      <Link
                        to={msg.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200/70 transition-colors"
                      >
                        <span>{msg.linkText || 'Open in FreshFind'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}

                  {/* Suggestions Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((suggestion, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200/60 transition-colors text-left"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Send Form */}
          <div className="p-3 bg-white border-t border-stone-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about markets, hours, produce..."
                className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
