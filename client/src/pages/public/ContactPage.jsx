import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { submitContact } from '../../services/contactService';
import { 
  FiPhone, 
  FiMail, 
  FiMapPin, 
  FiSend, 
  FiCheckCircle, 
  FiShield, 
  FiGithub, 
  FiLinkedin,
  FiCode
} from 'react-icons/fi';
import { MdAccountBalance, MdHowToVote } from 'react-icons/md';

const ContactPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await submitContact(data);
      if (res && (res.success || res.status === 'success')) {
        toast.success('Your grievance/message has been submitted to the help desk.');
        reset();
      } else {
        toast.success('Your message has been received.');
        reset();
      }
    } catch (err) {
      toast.error(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050b1a] text-slate-100 min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Top Banner */}
        <div className="bg-[#0a1428]/90 p-8 rounded-3xl shadow-xl border border-slate-800 text-center sm:text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <MdAccountBalance className="text-base" />
              <span>State Election Commission • Public Grievance Desk</span>
            </div>
            <h1 className="text-3xl font-black text-white font-serif">
              Contact & Voter Grievance Support
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Submit election inquiries, report voting vulnerabilities, or request KYC assistance.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs">
              <FiPhone className="text-emerald-400" />
              <span>Toll-Free: 1950</span>
            </span>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Official Contact & Developer Information */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Electoral Secretariat Info */}
            <div className="bg-[#0a1428]/80 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
                <MdAccountBalance className="text-blue-400 text-base" /> Electoral Secretariat
              </h3>

              <ul className="space-y-3.5 text-slate-300 leading-relaxed">
                <li className="flex items-start gap-3">
                  <FiMapPin className="text-amber-400 text-base mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white block">Chief Electoral Office:</strong>
                    <span>South Block, Secretariat, Hyderabad, Telangana — 500022</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <FiPhone className="text-emerald-400 text-base mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white block">Voters' Toll-Free Helpline:</strong>
                    <span>1800-425-1950 / 1950 (24x7 Support)</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <FiMail className="text-blue-400 text-base mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white block">Official Email:</strong>
                    <span>ceo-telangana@eci.gov.in</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Student Developer Info Card */}
            <div className="bg-gradient-to-br from-[#071126] to-[#0a1835] text-white rounded-2xl p-6 border border-slate-700/80 shadow-md space-y-4 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800 pb-2">
                <FiCode /> Lead Developer & Researcher
              </div>

              <div>
                <h4 className="font-bold text-base text-white">Badavath Madanlal</h4>
                <p className="text-slate-400 text-xs mt-0.5">B.Tech Computer Science & Engineering</p>
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-800 text-slate-300">
                <p className="flex items-center gap-2">
                  <FiMail className="text-blue-400" />
                  <span>Email: <strong className="text-white font-mono">badavathmadanlal06@gmail.com</strong></span>
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <a
                  href="https://github.com/badavathmadanlal"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl flex items-center justify-center gap-2 transition-colors font-bold"
                >
                  <FiGithub /> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/badavathmadanlal/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center gap-2 transition-colors font-bold shadow-sm"
                >
                  <FiLinkedin /> LinkedIn
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Grievance / Contact Form */}
          <div className="lg:col-span-7 bg-[#0a1428]/90 rounded-2xl p-8 border border-slate-800 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Submit an Inquiry or Feedback</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Our support team will review your ticket within 24 operational hours.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    {...register('name', { required: 'Full Name is required' })}
                    className="w-full bg-[#050b1a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:bg-[#071126] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    {...register('email', { required: 'Email address is required' })}
                    className="w-full bg-[#050b1a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:bg-[#071126] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    {...register('mobile')}
                    className="w-full bg-[#050b1a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:bg-[#071126] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Category *</label>
                  <select
                    {...register('category')}
                    className="w-full bg-[#050b1a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:bg-[#071126] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="General" className="bg-slate-900 text-white">General Inquiry</option>
                    <option value="Registration" className="bg-slate-900 text-white">Voter Registration</option>
                    <option value="Verification" className="bg-slate-900 text-white">KYC & Identity Verification</option>
                    <option value="Voting" className="bg-slate-900 text-white">Ballot & Polling Issues</option>
                    <option value="Technical" className="bg-slate-900 text-white">Technical / Bug Report</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Subject *</label>
                <input
                  type="text"
                  placeholder="Summary of your inquiry or feedback"
                  {...register('subject', { required: 'Subject is required' })}
                  className="w-full bg-[#050b1a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:bg-[#071126] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.subject && <p className="text-[11px] text-red-400 mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Message / Grievance Details *</label>
                <textarea
                  rows={4}
                  placeholder="Describe your question or issue in detail..."
                  {...register('message', { required: 'Message is required' })}
                  className="w-full bg-[#050b1a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:bg-[#071126] focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                ></textarea>
                {errors.message && <p className="text-[11px] text-red-400 mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Submitting Message...</span>
                ) : (
                  <>
                    <FiSend size={14} /> Submit Message to Help Desk
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;
