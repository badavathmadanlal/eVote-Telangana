import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getProfile, updateProfile } from '../../services/citizenService';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiShield, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiMapPin, 
  FiEdit3, 
  FiSave, 
  FiX, 
  FiCalendar, 
  FiLock,
  FiAward,
  FiInfo,
  FiMessageSquare
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance, MdFingerprint } from 'react-icons/md';

const CitizenProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    whatsappNumber: '',
    address: '',
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      if (res && res.data && res.data.profile) {
        setProfile(res.data.profile);
        populateFormData(res.data.profile);
      } else {
        setProfile(user);
        populateFormData(user);
      }
    } catch (err) {
      setProfile(user);
      populateFormData(user);
    } finally {
      setLoading(false);
    }
  };

  const populateFormData = (data) => {
    if (!data) return;
    setFormData({
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      whatsappNumber: data.whatsappNumber || '',
      address: data.address || '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await updateProfile(formData);
      if (res && res.data && res.data.profile) {
        toast.success('Profile updated successfully.');
        setProfile(res.data.profile);
        setIsEditing(false);
      } else {
        toast.success('Profile updated successfully.');
        setProfile(prev => ({ ...prev, ...formData }));
        setIsEditing(false);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const isKycVerified = Boolean(profile?.isKycVerified || profile?.isVerified || profile?.status === 'verified');
  const isDemo = Boolean(
    profile?.isDemoAccount || 
    user?.isDemoAccount || 
    (profile?.mobileNumber && profile.mobileNumber.startsWith('900000000')) ||
    (user?.mobileNumber && user.mobileNumber.startsWith('900000000')) ||
    user?.mobileNumber === '1234567890' || 
    user?.mobileNumber === '1234567891'
  );

  const fullName = profile?.fullName || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || user?.name || 'Citizen Voter';
  const mobile = profile?.mobileNumber || profile?.mobile || user?.mobileNumber || '9000000001';
  const state = profile?.state || user?.state || 'Telangana';
  const defaultEpic = profile?.epicNumber || user?.epicNumber || `DEMO-${state.slice(0, 3).toUpperCase()}-001`;
  const epic = profile?.epicNumber || profile?.voterId || (isDemo ? defaultEpic : 'TEL/2026/001');
  const district = profile?.district || user?.district || 'Central District';
  const mandal = profile?.mandal || user?.mandal || 'Headquarters';
  const constituency = profile?.constituency || user?.constituency || '057-Musheerabad';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <MdAccountBalance className="text-amber-600 text-sm" />
            <span>State Election Commission • Elector Registry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-serif">Citizen Voter Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">Verified digital credentials and constituency assignment details.</p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
            >
              <FiEdit3 /> Edit Safe Details
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setIsEditing(false); populateFormData(profile); }}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
            >
              <FiX /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Summary Avatar & Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center text-3xl font-black shadow-md border-2 border-white">
            {profile?.firstName?.[0]?.toUpperCase() || 'V'}
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">{fullName}</h2>
            <p className="text-xs text-slate-500 font-mono">{mobile}</p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {isDemo && (
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-md uppercase">
                Academic Demo
              </span>
            )}
            
            <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded-md uppercase">
              Mobile Verified
            </span>

            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase border ${
              isKycVerified
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              {isKycVerified ? 'KYC Verified' : 'KYC Pending'}
            </span>
          </div>

          {/* Quick Action */}
          {!isKycVerified && (
            <div className="w-full pt-4 border-t border-slate-100">
              <Link
                to="/citizen/verification"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-3 rounded-xl text-xs transition-colors shadow-xs"
              >
                <FiShield /> Complete KYC Verification
              </Link>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Detailed Elector Info & Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          
          {isEditing ? (
            /* EDIT FORM */
            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Edit Personal Details</h3>
                <span className="text-[11px] text-slate-400">Only non-electoral fields can be updated</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp Number (Optional)</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="10-digit WhatsApp number"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street / House address"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <FiSave /> {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          ) : (
            /* VIEW MODE */
            <div className="space-y-6 text-xs">
              
              {/* Section 1: Elector Identification */}
              <div>
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 mb-3">
                  Electoral Roll Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <p className="text-slate-500 text-[11px]">Voter ID / EPIC</p>
                    <p className="font-bold text-slate-900 font-mono mt-0.5 flex items-center justify-between">
                      <span>{epic}</span>
                      <FiLock className="text-slate-400 text-xs" title="Protected field" />
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <p className="text-slate-500 text-[11px]">Aadhaar Reference</p>
                    <p className="font-bold text-slate-900 font-mono mt-0.5 flex items-center justify-between">
                      <span>●●●● ●●●● {profile?.aadhaar?.slice(-4) || '1001'}</span>
                      <FiLock className="text-slate-400 text-xs" title="Protected field" />
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <p className="text-slate-500 text-[11px]">Registered Mobile</p>
                    <p className="font-bold text-slate-900 font-mono mt-0.5 flex items-center justify-between">
                      <span>{mobile}</span>
                      <FiLock className="text-slate-400 text-xs" title="Protected field" />
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <p className="text-slate-500 text-[11px]">WhatsApp (Receipts)</p>
                    <p className="font-bold text-slate-900 font-mono mt-0.5">
                      {profile?.whatsappNumber || 'Not configured'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Administrative Jurisdiction */}
              <div>
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 mb-3">
                  Electoral Jurisdiction
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <p className="text-slate-500 text-[11px]">State</p>
                    <p className="font-bold text-slate-900 mt-0.5">{state}</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <p className="text-slate-500 text-[11px]">District</p>
                    <p className="font-bold text-slate-900 mt-0.5">{district}</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <p className="text-slate-500 text-[11px]">Mandal / Taluka</p>
                    <p className="font-bold text-slate-900 mt-0.5">{mandal}</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <p className="text-slate-500 text-[11px]">Assembly Constituency</p>
                    <p className="font-bold text-slate-900 mt-0.5 flex items-center justify-between">
                      <span className="text-blue-700 font-semibold">{constituency}</span>
                      <FiLock className="text-slate-400 text-xs" title="Protected field" />
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Voting Information & Eligibility */}
              <div>
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 mb-3">
                  Voting Eligibility & Participation
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <p className="text-slate-500 text-[11px]">Voting Eligibility</p>
                    <p className={`font-bold mt-0.5 ${isKycVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {isKycVerified ? 'Eligible to Vote' : 'KYC Required'}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <p className="text-slate-500 text-[11px]">Constituency Elections</p>
                    <p className="font-bold text-slate-900 mt-0.5">Active Polling</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <p className="text-slate-500 text-[11px]">Electoral Status</p>
                    <p className="font-bold text-blue-700 mt-0.5 font-mono">
                      {profile?.hasVoted ? 'Ballot Cast' : 'Ready to Vote'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Protected Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
                <FiInfo className="text-blue-600 text-base shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Protected Elector Fields:</strong> Electoral jurisdiction and verification fields are protected and cannot be edited by the voter.
                </p>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CitizenProfile;
