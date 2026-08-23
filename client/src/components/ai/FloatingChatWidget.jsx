import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageSquare, 
  FiX, 
  FiSend, 
  FiCpu, 
  FiCheckCircle, 
  FiHelpCircle,
  FiShield,
  FiPhoneCall
} from 'react-icons/fi';
import { MdHowToVote, MdOutlineAutoAwesome } from 'react-icons/md';
import { chat } from '../../services/assistantService';

const CITIZEN_SUGGESTIONS = [
  'How do I verify my identity?',
  'What documents are required for KYC?',
  'How do I find an election & vote?',
  'Where can I see my voting history?',
  'How do I update my voter profile?',
  'How can I contact election helpline?'
];

const DEV_QUERY_PATTERNS = [
  /\b(jwt|json\s*web\s*token|bearer\s*token)\b/i,
  /\b(bcrypt|argon2|sha512|password\s*hash(ing)?|salt(ing)?)\b/i,
  /\b(mongodb|mongoose|database\s*schema|sql|nosql|database\s*model)\b/i,
  /\b(project\s*architecture|system\s*architecture|codebase|source\s*code)\b/i,
  /\b(react(\.js)?|node(\.js)?|express(\.js)?|vite|tailwind|package\.json)\b/i,
  /\b(rest\s*api|backend\s*framework|controller|middleware|api\s*endpoint)\b/i,
  /\b(how\s+is\s+(the\s+)?password\s+hashed|what\s+database\s+do\s+you\s+use|explain\s+the\s+project\s+architecture)\b/i
];

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      text: 'Namaste! I am the eVote Telangana Assistant. I can help you with voter registration, identity verification (KYC), finding elections, voting procedures, checking results, official announcements, profile updates, and portal navigation. How can I assist you today?' 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const toggleWidget = () => {
    setIsOpen(prev => !prev);
  };

  const handleSendMessage = async (textToSend) => {
    const messageText = typeof textToSend === 'string' ? textToSend : query;
    if (!messageText || !messageText.trim() || loading) return;

    const userMsg = messageText.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    // Check if query is developer/internal technical question
    const isDevQuery = DEV_QUERY_PATTERNS.some(pattern => pattern.test(userMsg));
    if (isDevQuery) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            text: "I can help you with eVote Telangana voter services, elections, verification, voting, results, announcements, and portal navigation. I can't provide internal developer documentation." 
          }
        ]);
        setLoading(false);
      }, 400);
      return;
    }

    try {
      const res = await chat(userMsg);
      if (res && res.success && res.data && res.data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
      } else if (res && res.data && res.data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
      } else {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            text: 'I can guide you with voter registration, polling schedules, KYC identity verification, and ballot casting procedures. You can also call the voter helpline at 1950.' 
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          text: 'Sorry, I am having trouble connecting to the election assistant service right now. Please try again in a moment or call our voter helpline at 1950.' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(query);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-4 w-[calc(100vw-2rem)] sm:w-[390px] h-[530px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col z-50 ring-1 ring-black/5"
            role="dialog"
            aria-label="eVote Telangana Election Assistant"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-4 flex items-center justify-between border-b border-slate-700/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                    <MdOutlineAutoAwesome className="text-lg text-amber-300" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white leading-tight flex items-center gap-1.5">
                    Election Assistant
                    <span className="text-[9px] bg-blue-500/30 text-blue-200 border border-blue-400/40 px-1.5 py-0.2 rounded font-semibold uppercase">
                      Citizen AI
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium">Chief Electoral Help Desk • Toll-Free 1950</p>
                </div>
              </div>

              <button
                onClick={toggleWidget}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close Assistant"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/80 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 shadow-sm mb-1">
                      <FiCpu size={12} />
                    </div>
                  )}

                  <div 
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none font-medium' 
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-slate-100'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 mb-1">
                    <FiCpu size={12} />
                  </div>
                  <div className="bg-white text-slate-500 border border-slate-200/80 rounded-2xl rounded-bl-none px-3.5 py-2.5 text-xs flex gap-1.5 items-center shadow-sm">
                    <span className="text-[11px] font-medium text-slate-500 mr-1">Analyzing query</span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              {/* Citizen Suggestion Chips (when only 1 or 2 messages) */}
              {messages.length <= 2 && !loading && (
                <div className="pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Citizen Voter Services
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {CITIZEN_SUGGESTIONS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(item)}
                        className="text-[11px] text-slate-700 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 rounded-lg px-2.5 py-1.5 text-left transition-all shadow-2xs"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0 items-center">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about elections, KYC, voting steps..."
                disabled={loading}
                className="flex-1 bg-slate-100/90 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={loading || !query.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2 rounded-xl transition-all shadow-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
                aria-label="Send Message"
              >
                <FiSend size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={toggleWidget}
        className="w-14 h-14 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl border-4 border-white transition-shadow focus:outline-none focus:ring-4 focus:ring-blue-500/40 relative"
        aria-label={isOpen ? "Close Election Assistant" : "Open AI Election Assistant"}
        title="AI Election Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <FiX />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <FiMessageSquare />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-white rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default FloatingChatWidget;
