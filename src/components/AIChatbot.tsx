import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Sparkles, ArrowRight, Check, CheckCheck } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the Owambe AI Assistant, a friendly and professional expert for Owambe Forex Academy.
Your goal is to help users with their trading journey, explain our services, and guide them through the platform.

CONTEXT ABOUT OWAMBE FOREX ACADEMY:
- Mentorship: Institutional-grade education. Plans: 1 month ($199), 3 months ($499), 6 months ($899), 1 year ($1499).
- Premium Signals: Daily high-probability setups with Entry, SL, and TP. $49/month.
- Prop Firm Passing: We help traders pass evaluations (FTMO, MFF, etc.) for a 10% fee of the account size.
- Investment Program: Managed accounts with consistent monthly returns.
- Account Management: Professional traders managing your personal capital.
- Support: Available 24/7 via the Support Center or Ticket system.

GUIDELINES:
1. Be conversational, friendly, and human-like. Avoid robotic or repetitive greetings.
2. Use internal links when referring to specific pages. Format them as [Page Name](/path).
   - Mentorship/Signals/Prop Firm: [/services](/services)
   - Investment: [/investment](/investment)
   - Support: [/support](/support)
   - Dashboard: [/profile](/profile)
   - FAQ: [/faq](/faq)
3. If you don't know something for sure, provide the best possible advice and suggest visiting the [/support](/support) page.
4. Keep responses structured with bullet points if they are long.
5. Answer global questions about trading, finance, and the economy with expertise.
`;

const SUGGESTIONS = [
  "How do I start investing?",
  "Tell me about mentorship",
  "How to verify my account?",
  "What are premium signals?",
];

const GeminiIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    animate={{
      filter: ["drop-shadow(0 0 2px #FFD700)", "drop-shadow(0 0 8px #FFD700)", "drop-shadow(0 0 2px #FFD700)"],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <path
      d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
      fill="currentColor"
    />
  </motion.svg>
);

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  isTyping?: boolean;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'seen';
}

export default function AIChatbot() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'initial',
      text: "Hello! I'm your Owambe AI Assistant. Ready to level up your trading journey? How can I help you today?", 
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isProfileOrSettings = location.pathname.startsWith('/profile') || location.pathname.includes('settings');

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isProfileOrSettings) {
      timeout = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
    } else {
      setIsVisible(false);
      setIsOpen(false);
    }
    return () => clearTimeout(timeout);
  }, [isProfileOrSettings]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const updateMessageStatus = (id: string, status: 'sent' | 'delivered' | 'seen') => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const simulateTyping = async (fullText: string) => {
    setIsTyping(true);
    
    // Split text into chunks for human-like typing
    const chunks = fullText.split(/(\s+)/);
    let currentText = "";
    
    const botMessageId = Math.random().toString(36).substring(7);
    setMessages(prev => [...prev, { 
      id: botMessageId,
      text: "", 
      isBot: true, 
      isTyping: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    for (let i = 0; i < chunks.length; i++) {
      currentText += chunks[i];
      
      // Update the last message
      setMessages(prev => {
        const newMessages = [...prev];
        const index = newMessages.findIndex(m => m.id === botMessageId);
        if (index !== -1) {
          newMessages[index] = { ...newMessages[index], text: currentText };
        }
        return newMessages;
      });

      // Variable typing speed
      const delay = chunks[i].length > 10 ? 100 : 30;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Occasional pauses for "thinking"
      if (i % 15 === 0 && i !== 0) {
        await new Promise(resolve => setTimeout(resolve, 400));
      }
    }

    setMessages(prev => {
      const newMessages = [...prev];
      const index = newMessages.findIndex(m => m.id === botMessageId);
      if (index !== -1) {
        newMessages[index] = { ...newMessages[index], text: fullText, isTyping: false };
      }
      return newMessages;
    });
    setIsTyping(false);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMessageId = Math.random().toString(36).substring(7);
    const userMessageText = textToSend.trim();
    
    const newUserMessage: Message = { 
      id: userMessageId,
      text: userMessageText, 
      isBot: false,
      status: 'sent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');

    // Simulate delivery
    setTimeout(() => updateMessageStatus(userMessageId, 'delivered'), 500);
    // Simulate seen
    setTimeout(() => updateMessageStatus(userMessageId, 'seen'), 1200);

    try {
      // Small delay before AI starts typing
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsTyping(true);
      
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "dummy-gemini-key" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "user", parts: [{ text: `System Instruction: ${SYSTEM_INSTRUCTION}` }] },
          ...messages.map(m => ({
            role: m.isBot ? "model" : "user",
            parts: [{ text: m.text }]
          })),
          { role: "user", parts: [{ text: userMessageText }] }
        ],
      });

      const botResponse = response.text || "I'm sorry, I'm having trouble connecting right now. Please try again later.";
      await simulateTyping(botResponse);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { 
        id: Math.random().toString(36).substring(7),
        text: "I'm currently offline. Please contact our support team for assistance.", 
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }
  };

  const renderMessageText = (text: string) => {
    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        const label = match[1];
        const path = match[2];
        const isExternal = path.startsWith('http');
        
        if (isExternal) {
          return (
            <a key={i} href={path} target="_blank" rel="noopener noreferrer" className="text-brand-primary underline font-bold hover:opacity-80">
              {label}
            </a>
          );
        }
        return (
          <Link key={i} to={path} className="text-brand-primary underline font-bold hover:opacity-80">
            {label}
          </Link>
        );
      }
      return part;
    });
  };

  if (isMobile && !isVisible) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-brand-primary text-bg-primary rounded-full shadow-lg shadow-brand-primary/20 flex items-center justify-center hover:scale-110 transition-transform ${isOpen ? 'hidden' : 'block'}`}
      >
        <GeminiIcon size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[320px] sm:w-[440px] h-[500px] sm:h-[600px] bg-surface rounded-2xl border border-border-base shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-primary/10 p-3 sm:p-4 border-b border-border-base flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-bg-primary shadow-lg shadow-brand-primary/20">
                  <GeminiIcon size={20} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-text-primary leading-tight">Owambe AI</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success"></span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-text-muted font-normal tracking-wide">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text-primary transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 scrollbar-hide bg-bg-primary/30">
              {messages.map((msg, i) => (
                <div key={msg.id} className={`flex flex-col ${msg.isBot ? 'items-start' : 'items-end'}`}>
                  {/* Sender Name */}
                  <span className="text-[10px] text-text-muted mb-1 px-1 font-medium">
                    {msg.isBot ? 'Owambe AI' : 'You'}
                  </span>
                  
                  <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[80%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    {msg.isBot && (
                      <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0 mb-1">
                        <Bot size={14} />
                      </div>
                    )}
                    
                    <div className={`relative p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                      msg.isBot 
                        ? 'bg-surface border border-border-base text-text-secondary rounded-tl-sm' 
                        : 'bg-brand-primary text-bg-primary font-medium rounded-tr-sm'
                    }`}>
                      <div className="pr-12">
                        {msg.isBot ? renderMessageText(msg.text) : msg.text}
                      </div>
                      
                      {/* Timestamp and Status */}
                      <div className={`absolute bottom-1 right-2 flex items-center gap-1 text-[9px] ${msg.isBot ? 'text-text-muted' : 'text-bg-primary/70'}`}>
                        <span>{msg.timestamp}</span>
                        {!msg.isBot && (
                          <span className="ml-0.5">
                            {msg.status === 'sent' && <Check size={10} />}
                            {msg.status === 'delivered' && <CheckCheck size={10} />}
                            {msg.status === 'seen' && <CheckCheck size={10} className="text-success" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <span className="text-[10px] text-text-muted mb-1 px-1 font-medium">Owambe AI</span>
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0 mb-1">
                      <Bot size={14} />
                    </div>
                    <div className="bg-surface border border-border-base p-3 rounded-2xl rounded-tl-sm flex gap-1 shadow-sm">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && !isTyping && (
              <div className="px-3 sm:px-4 pb-2 flex flex-wrap gap-2 bg-bg-primary/30">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="text-[10px] sm:text-xs bg-surface border border-border-base text-text-secondary px-3 py-1.5 rounded-full hover:border-brand-primary/50 hover:text-brand-primary transition-all flex items-center gap-1.5 group shadow-sm"
                  >
                    {s}
                    <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 sm:p-4 border-t border-border-base bg-surface">
              <div className="relative flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="w-full bg-bg-secondary border border-border-base rounded-2xl py-3 pl-4 pr-4 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-brand-primary/50 transition-colors placeholder:text-text-muted"
                  />
                </div>
                <button 
                  disabled={isTyping || !input.trim()}
                  onClick={() => handleSend()}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    isTyping || !input.trim() ? 'bg-bg-secondary text-text-muted cursor-not-allowed' : 'bg-brand-primary text-bg-primary hover:bg-brand-secondary shadow-lg shadow-brand-primary/20 active:scale-90'
                  }`}
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
