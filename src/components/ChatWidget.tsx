import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, CornerDownLeft, Sparkles } from 'lucide-react';
import { ChatMessage, Dictionary } from '../types';

interface ChatWidgetProps {
  dict: Dictionary;
}

export default function ChatWidget({ dict }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: dict.aiChatWelcome,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      // POST requests to our full-stack server backend `/api/chat` proxy
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-5) // Send last 5 messages for context
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: "msg-" + (Date.now() + 1),
        sender: "assistant",
        text: data.text || "Pardon, I am processing your culinary request.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat API call error:", err);
      
      // Fallback response simulation
      const fallbackMsg: ChatMessage = {
        id: "msg-err",
        sender: "assistant",
        text: "I am having minor network latency. Please feel free to call our hotlines or check our Locations & Delivery page for direct estimates. 🍲",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAsk = (question: string) => {
    handleSend(question);
  };

  const quickPrompts = [
    "Recommend best dishes",
    "GCash Number & Bank Details",
    "Our Location address",
    "Delivery fees to Makati"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Maximized Chat Bubble */}
      {isOpen ? (
        <div className="w-[320px] sm:w-[360px] h-[460px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-200">
          
          {/* Header */}
          <div className="bg-emerald-600 px-4 py-3.5 flex items-center justify-between text-white shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Bot className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs sm:text-sm tracking-tight">{dict.aiChatTitle}</h4>
                <span className="text-[10px] opacity-90 block tracking-wide">{dict.aiChatSub}</span>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-white/10 text-white cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Quick Info Bar */}
          <div className="bg-amber-50 px-3 py-1.5 border-b border-amber-100/50 flex items-center gap-1.5 text-[10px] text-amber-800 font-semibold">
            <Sparkles className="h-3 w-3 text-amber-600 shrink-0" />
            <span>AI recommendation active in EN, VI, and TL (Tagalog)</span>
          </div>

          {/* Messages Logs Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-50/50">
            {messages.map((msg) => {
              const isMe = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 items-end ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Assistant Avatar */}
                  {!isMe && (
                    <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs shrink-0 font-bold border border-emerald-200">
                      🇻🇳
                    </div>
                  )}

                  <div className="space-y-0.5 max-w-[75%]">
                    <div
                      className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed font-normal shadow-2xs ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    
                    <span className="text-[8px] text-gray-400 block font-semibold px-1 text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 items-end justify-start">
                <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs shrink-0 font-bold border border-emerald-200">
                  🇻🇳
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-2xs">
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={bottomRef} />
          </div>

          {/* Quick Prompts Chips Scroll */}
          <div className="px-3.5 py-2 border-t border-gray-50 flex gap-1.5 overflow-x-auto bg-white scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAsk(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full border border-gray-200 text-[10px] text-gray-600 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 transition-all cursor-pointer font-medium"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Panel */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            className="p-3 border-t border-gray-100 bg-white flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={dict.aiChatPlaceholder}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                !inputVal.trim() || isTyping
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

        </div>
      ) : (
        /* Minimized Chat Bubble Trigger */
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl hover:scale-105 transition-all cursor-pointer z-50 animate-bounce"
          title="AI Culinary Support"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      )}

    </div>
  );
}
