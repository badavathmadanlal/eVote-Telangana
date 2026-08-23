import React, { useState, useEffect } from 'react';
import { getFaqs } from '../../services/faqService';
import { 
  FiHelpCircle, 
  FiChevronDown, 
  FiSearch, 
  FiPhoneCall, 
  FiShield, 
  FiMessageSquare,
  FiFileText
} from 'react-icons/fi';
import { MdAccountBalance, MdHowToVote } from 'react-icons/md';

const FAQ_CATEGORIES = ['All', 'Registration', 'Verification', 'Voting', 'Security', 'General'];

const DEFAULT_FAQS = [
  {
    question: "How do I register as a remote voter in Telangana?",
    answer: "You can create an account by clicking 'Register to Vote'. Enter your first name, last name, email, mobile number, and your 10-character EPIC (Voter ID) number from your Election Photo Identity Card.",
    category: "Registration"
  },
  {
    question: "What is KYC Verification and why is it mandatory?",
    answer: "Identity (KYC) Verification cross-references your voter ID and Aadhaar details with the State Electoral Roll to ensure only eligible, authenticated electors can participate in scheduled elections.",
    category: "Verification"
  },
  {
    question: "How is my digital vote kept completely secret?",
    answer: "The platform uses 256-bit homomorphic encryption and cryptographic anonymization. When you cast a ballot, your personal identity is detached from the encrypted vote before it enters the digital ballot box.",
    category: "Security"
  },
  {
    question: "Can I change my vote once it has been submitted?",
    answer: "No. In accordance with standard constitutional voting laws, once a vote is encrypted and confirmed on the ledger, it is final and cannot be altered or re-cast.",
    category: "Voting"
  },
  {
    question: "What is the cryptographic receipt hash?",
    answer: "After casting a ballot, the system generates a unique mathematical cryptographic token (e.g. 0x8f2a...c91d) as proof of your participation without revealing your candidate selection.",
    category: "Security"
  },
  {
    question: "Who do I contact if I face technical issues while voting?",
    answer: "You can reach the National Voters' Toll-Free Helpline at 1950 (24x7 support) or submit a message via the Contact page.",
    category: "General"
  }
];

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await getFaqs();
      if (res && res.success && Array.isArray(res.data?.faqs) && res.data.faqs.length > 0) {
        setFaqs(res.data.faqs);
      } else if (res && Array.isArray(res.data) && res.data.length > 0) {
        setFaqs(res.data);
      } else {
        setFaqs(DEFAULT_FAQS);
      }
    } catch (err) {
      setFaqs(DEFAULT_FAQS);
    } finally {
      setLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const q = faq.question || '';
    const a = faq.answer || '';
    const cat = faq.category || 'General';

    const matchesCat = activeCategory === 'All' || cat.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch = q.toLowerCase().includes(searchQuery.toLowerCase()) || a.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-[#050b1a] text-slate-100 min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Banner */}
        <div className="bg-[#0a1428]/90 p-8 rounded-3xl shadow-xl border border-slate-800 text-center sm:text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <MdAccountBalance className="text-base" />
              <span>State Election Commission • Voter Help Desk</span>
            </div>
            <h1 className="text-3xl font-black text-white font-serif">
              Frequently Asked Questions
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Instant answers regarding voter registration, KYC, ballot security, and counting procedures.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs">
              <FiHelpCircle className="text-blue-400" />
              <span>24x7 Help Desk</span>
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-[#0a1428]/80 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 custom-scrollbar">
            {FAQ_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'bg-[#050b1a] text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full bg-[#050b1a] border border-slate-700 text-white rounded-xl pl-9 pr-3.5 py-2 text-xs placeholder:text-slate-500 focus:bg-[#071126] focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        {loading ? (
          <div className="bg-[#0a1428]/80 rounded-2xl p-12 border border-slate-800 text-center space-y-3 shadow-sm">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-medium text-slate-400">Loading frequently asked questions...</p>
          </div>
        ) : filteredFaqs.length > 0 ? (
          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={faq._id || idx}
                  className="bg-[#0a1428]/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-white hover:bg-slate-800/60 transition-colors focus:outline-none cursor-pointer"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <FiChevronDown className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs text-slate-300 border-t border-slate-800/80 bg-[#071126]/60 leading-relaxed space-y-2">
                      <p className="pt-3">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#0a1428]/80 rounded-2xl p-12 border border-slate-800 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl mx-auto flex items-center justify-center text-3xl">
              <FiHelpCircle />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">No Questions Found</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                No FAQs match your search query. You can ask our AI Assistant in the bottom right corner or contact the voter helpline.
              </p>
            </div>
          </div>
        )}

        {/* Still Have Questions Box */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold font-serif">Still have questions or facing technical difficulty?</h3>
            <p className="text-xs text-slate-300">
              Our 24x7 National Voter Helpline and Grievance Portal are available for all Telangana electors.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:1950"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              <FiPhoneCall /> Call 1950
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FaqPage;
