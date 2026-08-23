import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiSend, 
  FiCheckCircle, 
  FiRefreshCw, 
  FiChevronRight 
} from 'react-icons/fi';
import { MdOutlineAutoAwesome } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import { sendAiChat } from '../../services/aiService';

const QUICK_QUESTIONS = [
  { icon: '🗳️', label: 'Who are the candidates in my constituency?', query: 'Who are the candidates contesting in my constituency?' },
  { icon: '📅', label: 'When is my next election?', query: 'When is the election schedule for my constituency?' },
  { icon: '✅', label: 'Am I eligible to vote?', query: 'Am I eligible to vote and what is my verification status?' },
  { icon: '📋', label: 'How do I cast my vote?', query: 'What are the steps to cast a remote ballot?' },
  { icon: '🧾', label: 'Where can I find my voting receipt?', query: 'Where is my voting receipt and participation history?' }
];

const RELATED_TOPICS = [
  { label: '🗳️ Candidates', query: 'Who are the candidates contesting in my constituency?' },
  { label: '📋 How to Vote', query: 'What are the steps to cast a remote ballot?' },
  { label: '🧾 Voting Receipt', query: 'Where is my voting receipt and participation history?' }
];

const AIElectionAssistant = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const isSendingRef = useRef(false);
  const currentUserIdRef = useRef(null);

  const isUserAuth = Boolean(user?._id || isAuthenticated || (typeof window !== 'undefined' && localStorage.getItem('token')));
  const userState = user?.state || 'Telangana';
  const firstName = user?.firstName || user?.name || 'Citizen';
  const userId = user?._id || (isUserAuth ? 'auth-user' : 'anonymous');

  // 1. Single Safe Welcome Message
  useEffect(() => {
    if (currentUserIdRef.current !== userId) {
      currentUserIdRef.current = userId;
      const welcomeText = isUserAuth
        ? `Hi ${firstName}! 👋 I'm your eVote AI Assistant. Ask me about elections, candidates, voting process, or your constituency (${userState}). How can I help you today?`
        : `Hi! 👋 I'm your eVote AI Assistant. Ask me about elections, candidates, voting process, or your constituency. How can I help you today?`;

      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          text: welcomeText,
          category: isUserAuth ? 'WELCOME' : 'PUBLIC_WELCOME',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [userId, isUserAuth, userState, firstName]);

  // 2. Auto-scroll on new messages
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages.length, loading, isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 3. Single Message Dispatcher with Mutex Lock
  const handleSendMessage = async (textToSend) => {
    const rawText = typeof textToSend === 'string' ? textToSend : query;
    if (!rawText || !rawText.trim()) return;

    const messageText = rawText.trim();

    if (isSendingRef.current || loading) return;
    isSendingRef.current = true;
    setLoading(true);
    setLastFailedQuery(null);

    const userMessageId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    setMessages(prev => [
      ...prev,
      {
        id: userMessageId,
        role: 'user',
        text: messageText,
        timestamp: new Date().toISOString()
      }
    ]);

    setQuery('');

    try {
      if (!isUserAuth) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const authNoticeId = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        setMessages(prev => [
          ...prev,
          {
            id: authNoticeId,
            role: 'assistant',
            text: 'Please sign in with your registered citizen account to access personalized constituency and candidate information.',
            category: 'AUTH_REQUIRED',
            timestamp: new Date().toISOString()
          }
        ]);
        return;
      }

      const res = await sendAiChat(messageText);
      const aiData = res?.data?.data || res?.data || res || {};
      const aiResponseText = aiData.message || 'I have retrieved your authorized election information.';

      const assistantMessageId = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      setMessages(prev => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          text: aiResponseText,
          category: aiData.category || 'ASSISTANT_RESPONSE',
          toolUsed: aiData.toolUsed,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (err) {
      setLastFailedQuery(messageText);
      const errorMessageId = `err-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const errorText = err?.response?.data?.message || err?.message || 'The assistant is temporarily unable to retrieve election records. Please try again.';
      setMessages(prev => [
        ...prev,
        {
          id: errorMessageId,
          role: 'assistant',
          text: errorText,
          isError: true,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
      isSendingRef.current = false;
    }
  };

  const handleRetry = () => {
    if (lastFailedQuery && !loading) {
      handleSendMessage(lastFailedQuery);
    }
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[9999] pointer-events-auto select-none max-w-[calc(100vw-24px)]">
      
      {/* 1. Compact Floating Launcher Button when Closed */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl border border-blue-400/40 flex items-center gap-2 transition-all group cursor-pointer"
          title="Open eVote AI Assistant"
          aria-label="Open eVote AI Assistant"
        >
          {/* Ambient Glow Aura */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-40 blur-md group-hover:opacity-75 transition-opacity pointer-events-none" />

          <div className="relative flex items-center gap-2">
            <MdOutlineAutoAwesome className="text-base sm:text-lg text-amber-300 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wide">
              ✨ eVote AI Assistant
            </span>
          </div>
        </motion.button>
      )}

      {/* 2. Compact Floating Chatbot Widget (Responsive) */}
      <AnimatePresence>
        {isOpen && (
          <div className="relative">
            
            {/* Ambient Decorative Sparkles (Hidden on mobile to avoid overflow) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute -inset-8 z-0 overflow-visible hidden sm:block"
            >
              {/* Sparkle 1 (Top Left) */}
              <motion.span
                animate={{ y: [-4, 4, -4], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-2 -left-3 text-amber-300 text-sm drop-shadow"
              >
                ✦
              </motion.span>
              {/* Sparkle 2 (Top Center) */}
              <motion.span
                animate={{ y: [3, -3, 3], opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-4 left-1/3 text-blue-300 text-base drop-shadow"
              >
                ✧
              </motion.span>
              {/* Sparkle 3 (Top Right) */}
              <motion.span
                animate={{ y: [-5, 5, -5], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -top-3 -right-2 text-amber-400 text-lg drop-shadow"
              >
                ✨
              </motion.span>
              {/* Sparkle 4 (Middle Right) */}
              <motion.span
                animate={{ y: [4, -4, 4], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="absolute top-1/2 -right-5 text-indigo-300 text-xs drop-shadow"
              >
                ✦
              </motion.span>
              {/* Sparkle 5 (Bottom Left) */}
              <motion.span
                animate={{ y: [-3, 3, -3], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute bottom-6 -left-4 text-amber-300 text-sm drop-shadow"
              >
                ✧
              </motion.span>
            </motion.div>

            {/* Widget Main Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-[calc(100vw-24px)] max-w-[340px] sm:w-[325px] h-[480px] max-h-[calc(100vh-80px)] bg-white rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.3),0_20px_50px_-10px_rgba(0,0,0,0.5)] border border-blue-200/80 flex flex-col overflow-hidden"
            >
              
              {/* Header: Blue Gradient with Sparkle Icon, Status & Prominent Close Button */}
              <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-3.5 px-4 flex items-center justify-between shadow-md shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-amber-300 text-base shrink-0 shadow-xs">
                    <MdOutlineAutoAwesome />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs tracking-wide leading-tight flex items-center gap-1.5">
                      <span>eVote AI Assistant</span>
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-[10px] text-blue-100 font-medium leading-none">Online</span>
                    </div>
                  </div>
                </div>

                {/* Close Button X (Positioned Inside Header, High Z-Index) */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Close Assistant"
                  aria-label="Close Assistant"
                >
                  <FiX size={15} />
                </button>
              </div>

              {/* Chat Message & Quick Questions Area */}
              <div className="flex-1 p-3 sm:p-3.5 overflow-y-auto overflow-x-hidden space-y-3 bg-slate-50/60 text-xs custom-scrollbar">
                
                {/* Initial Welcome Text & Quick Questions List */}
                {messages.length <= 1 && (
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs text-slate-700 leading-relaxed">
                      <p>
                        Hi! 👋 I'm your <strong>eVote AI Assistant</strong>. Ask me about elections, candidates, voting process, or your constituency. How can I help you today?
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <span>💡 Quick Questions</span>
                      </p>

                      <div className="space-y-1.5">
                        {QUICK_QUESTIONS.map((q, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04, duration: 0.2 }}
                            whileHover={{ scale: 1.01, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSendMessage(q.query)}
                            disabled={loading}
                            className="w-full text-left px-2.5 sm:px-3 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200/90 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-[11px] sm:text-xs font-medium transition-all shadow-2xs flex items-center justify-between group cursor-pointer disabled:opacity-50"
                          >
                            <span className="truncate flex items-center gap-2">
                              <span className="text-sm shrink-0">{q.icon}</span>
                              <span className="truncate">{q.label}</span>
                            </span>
                            <FiChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5 shrink-0 ml-1" />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Conversation Message History */}
                {messages.length > 1 && messages.map((msg) => {
                  const isUser = msg.role === 'user';

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: isUser ? 12 : -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
                    >
                      <div
                        className={`max-w-[90%] rounded-2xl p-3 leading-relaxed break-words overflow-hidden ${
                          isUser
                            ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                            : msg.isError
                            ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-none'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
                        }`}
                        style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>

                      {!isUser && msg.toolUsed && msg.toolUsed !== 'none' && (
                        <span className="text-[9px] font-mono text-slate-400 mt-1 ml-1 flex items-center gap-1">
                          <FiCheckCircle className="text-emerald-500 text-[10px]" /> Verified
                        </span>
                      )}

                      {!isUser && msg.isError && lastFailedQuery && (
                        <button
                          onClick={handleRetry}
                          disabled={loading}
                          className="mt-1 ml-1 inline-flex items-center gap-1 text-[10px] font-bold text-red-600 hover:text-red-800 underline cursor-pointer"
                        >
                          <FiRefreshCw size={10} /> Retry
                        </button>
                      )}
                    </motion.div>
                  );
                })}

                {/* Follow-up Quick Chips */}
                {messages.length > 1 && !loading && (
                  <div className="pt-2 flex flex-wrap gap-1">
                    {RELATED_TOPICS.map((topic, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(topic.query)}
                        className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 transition-all shadow-2xs cursor-pointer"
                      >
                        {topic.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Typing Indicator */}
                {loading && (
                  <div className="flex items-start">
                    <div className="bg-white text-slate-600 border border-slate-200 rounded-2xl rounded-bl-none p-2.5 shadow-2xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Input Area */}
              <div className="p-2.5 px-3 bg-white border-t border-slate-100 shrink-0 space-y-1">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask anything..."
                    maxLength={500}
                    disabled={loading}
                    className="flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none min-w-0"
                  />

                  <button
                    type="submit"
                    disabled={!query.trim() || loading}
                    className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs"
                    title="Send"
                    aria-label="Send"
                  >
                    <FiSend size={12} className="ml-0.5" />
                  </button>
                </form>

                {/* Subtitle Footer */}
                <div className="text-center pt-0.5">
                  <span className="text-[9px] text-slate-400 font-medium">
                    ✨ eVote AI Assistant
                  </span>
                </div>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIElectionAssistant;
