import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { getFaqs } from '../../services/faqService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { FiChevronDown } from 'react-icons/fi';

const FaqPage = () => {
  const { data, loading, error } = useFetch(getFaqs);
  const [openIndex, setOpenIndex] = useState(null);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="max-w-4xl mx-auto py-8 px-4"><ErrorMessage message={error} /></div>;

  const faqs = data?.faqs || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h1>
      {faqs.length === 0 ? (
        <p className="text-gray-500">No FAQs available at the moment.</p>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={faq._id || idx} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <span>{faq.question}</span>
                <FiChevronDown className={`transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === idx && (
                <div className="p-4 pt-0 text-sm text-gray-600 border-t border-gray-50 bg-gray-50/50 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FaqPage;
