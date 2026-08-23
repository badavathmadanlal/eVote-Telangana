import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { verifyCitizen, getProfile } from '../../services/citizenService';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { 
  FiShield, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiFileText, 
  FiCreditCard, 
  FiLock, 
  FiArrowRight,
  FiInfo,
  FiRefreshCw
} from 'react-icons/fi';
import { MdHowToVote, MdAccountBalance, MdFingerprint } from 'react-icons/md';

const CitizenVerification = () => {
  const { user, updateUser } = useAuth();

  const isDemo = Boolean(
    user?.isDemoAccount || 
    (user?.mobileNumber && user.mobileNumber.startsWith('900000000')) ||
    user?.mobileNumber === '1234567890' || 
    user?.mobileNumber === '1234567891'
  );

  const userState = user?.state || 'Telangana';

  const defaultEpic = user?.epicNumber || (
    userState === 'Assam' ? 'DEMO-AS-001' :
    userState === 'Delhi' ? 'DEMO-DEL-001' :
    userState === 'Tamil Nadu' ? 'DEMO-TN-001' :
    userState === 'Maharashtra' ? 'DEMO-MH-001' :
    userState === 'Andhra Pradesh' ? 'DEMO-AP-001' :
    'DEMO-TEL-001'
  );

  const defaultAadhaar = user?.aadhaar || `DEMO-AADHAAR-${defaultEpic.slice(-3)}`;
  const defaultConstituency = user?.constituency || (
    userState === 'Assam' ? '051-Jalukbari' :
    userState === 'Delhi' ? '040-New Delhi' :
    userState === 'Tamil Nadu' ? '011-Dr. Radhakrishnan Nagar' :
    userState === 'Maharashtra' ? '182-Worli' :
    userState === 'Andhra Pradesh' ? '019-Vijayawada West' :
    '057-Musheerabad'
  );

  const [profile, setProfile] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [voterId, setVoterId] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkVerificationStatus();
  }, [user]);

  const checkVerificationStatus = async () => {
    try {
      setLoadingStatus(true);
      setLoadError(null);

      // 1. Check local context first
      if (user?.isKycVerified || user?.isVerified) {
        setIsVerified(true);
        setVoterId(user.epicNumber || user.voterId || defaultEpic);
        setAadhaar(isDemo ? defaultAadhaar : '●●●● ●●●● 1001');
      }

      // 2. Fetch latest profile from backend
      const res = await getProfile().catch(() => null);
      if (res && res.data && res.data.profile) {
        const prof = res.data.profile;
        setProfile(prof);
        const verified = Boolean(prof.isKycVerified || prof.isVerified || prof.status === 'verified');
        setIsVerified(verified);

        if (verified) {
          setVoterId(prof.epicNumber || prof.voterId || defaultEpic);
          setAadhaar(isDemo ? defaultAadhaar : (prof.aadhaar || ''));
        } else if (isDemo) {
          setVoterId(prof.epicNumber || defaultEpic);
          setAadhaar(prof.aadhaar || defaultAadhaar);
          setConsent(true);
        }
      } else if (isDemo) {
        setVoterId(defaultEpic);
        setAadhaar(defaultAadhaar);
        setConsent(true);
      }
    } catch (err) {
      if (isDemo) {
        setVoterId(defaultEpic);
        setAadhaar(defaultAadhaar);
        setConsent(true);
      } else {
        setLoadError('Unable to load verification status. Please check your network connection.');
      }
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!voterId.trim() || !aadhaar.trim()) {
      toast.error(isDemo ? 'Please provide both Demo Voter ID and Demo Aadhaar Identifier' : 'Please enter both Voter ID and 12-digit Aadhaar Number');
      return;
    }

    if (!consent) {
      toast.error('Please accept the declaration consent');
      return;
    }

    try {
      setSubmitting(true);
      const res = await verifyCitizen({
        voterId: voterId.trim(),
        aadhaar: aadhaar.trim()
      });

      if (res && (res.success || res.status === 'success' || res.data?.citizen)) {
        toast.success(res.message || 'Identity verified successfully! You are now eligible to vote.');
        setIsVerified(true);
        if (updateUser) {
          updateUser({ 
            isKycVerified: true, 
            isVerified: true, 
            kycStatus: 'KYC_VERIFIED', 
            eligibilityStatus: 'ELIGIBLE',
            epicNumber: voterId.trim() 
          });
        }
      }
    } catch (err) {
      toast.error(err.message || 'Verification failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayState = profile?.state || userState;
  const displayDistrict = profile?.district || user?.district || 'Central District';
  const displayMandal = profile?.mandal || user?.mandal || 'Headquarters';
  const displayLocality = profile?.village || user?.village || 'Locality Center';
  const displayConstituency = profile?.constituency || defaultConstituency;
  const displayName = profile?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Citizen Voter');

  if (loadingStatus) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-sm">Authenticating Digital Electoral Record...</h3>
            <p className="text-xs text-slate-500">Checking State Election Commission verification status for {displayState}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError && !isDemo) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-12">
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center space-y-4 shadow-sm">
          <FiAlertCircle className="text-3xl text-red-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-sm">Verification Status Unavailable</h3>
            <p className="text-xs text-slate-500">{loadError}</p>
          </div>
          <button
            onClick={checkVerificationStatus}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
          >
            <FiRefreshCw /> Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <MdAccountBalance className="text-amber-600 text-sm" />
            <span>State Election Commission • eVote {displayState}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-serif">
            {isDemo ? `${displayState} Demo Identity Verification` : `Voter Identity Verification (KYC)`}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isDemo 
              ? `Fictional demo verification for ${displayState} Final Year Project Demonstration.` 
              : `Authenticate your state electoral roll credentials to unlock remote voting for ${displayState}.`}
          </p>
        </div>

        {isVerified ? (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-xl border border-emerald-200 shrink-0">
            <FiCheckCircle className="text-emerald-600 text-base" />
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-emerald-600">KYC Status</p>
              <p className="text-xs font-bold">Verified Elector</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-3.5 py-2 rounded-xl border border-amber-200 shrink-0">
            <FiAlertCircle className="text-amber-600 text-base" />
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-amber-600">KYC Status</p>
              <p className="text-xs font-bold">Pending Verification</p>
            </div>
          </div>
        )}
      </div>

      {/* Demo Mode Notice Banner */}
      {isDemo && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4.5 flex items-start gap-3 text-amber-950">
          <FiInfo className="text-amber-600 text-xl shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-black uppercase tracking-wider text-[11px] text-amber-900">
              DEMO IDENTITY VERIFICATION — {displayState.toUpperCase()}
            </p>
            <p className="text-amber-900/90 leading-relaxed">
              This is a simulated verification for the <strong>Final Year Project Demonstration</strong>. These fictional credentials authenticate your sample elector session for <strong>{displayConstituency}</strong> without querying real government databases.
            </p>
          </div>
        </div>
      )}

      {isVerified ? (
        /* ALREADY VERIFIED CARD */
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">
            <FiCheckCircle />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-slate-900 font-serif">Identity Verification Complete</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your electoral identity has been verified on the digital roll for <strong>{displayState}</strong>. You are authorized to access ballots for <strong>{displayConstituency}</strong>.
            </p>
            {isDemo && (
              <p className="text-[11px] text-amber-800 bg-amber-50 py-1.5 px-3 rounded-lg border border-amber-200 font-semibold">
                Simulated verification — Final Year Project Demonstration
              </p>
            )}
          </div>

          {/* Details Table */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 max-w-md mx-auto text-left space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Citizen Name</span>
              <span className="font-bold text-slate-900">{displayName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">State & District</span>
              <span className="font-semibold text-slate-900">{displayState} • {displayDistrict}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Mandal & Locality</span>
              <span className="font-semibold text-slate-900">{displayMandal} • {displayLocality}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Voter ID (EPIC)</span>
              <span className="font-mono font-bold text-blue-700">{voterId || defaultEpic}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Registered Constituency</span>
              <span className="font-bold text-slate-900">{displayConstituency}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Voting Eligibility</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <FiCheckCircle size={12} /> Eligible to Vote
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/citizen/elections"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-md"
            >
              <MdHowToVote className="text-base" />
              <span>Proceed to Active Elections</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      ) : (
        /* VERIFICATION FORM */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isDemo ? 'Demo Voter ID / EPIC *' : 'Voter ID / EPIC Number *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiFileText />
                </div>
                <input
                  type="text"
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value)}
                  placeholder={isDemo ? defaultEpic : 'e.g. TEL/2026/094821'}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none uppercase font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isDemo ? 'Demo Aadhaar Identifier *' : 'Aadhaar Number (12 Digits) *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MdFingerprint className="text-base" />
                </div>
                <input
                  type="text"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  placeholder={isDemo ? defaultAadhaar : '12-digit Aadhaar number'}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none uppercase font-bold"
                />
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="kycConsent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <label htmlFor="kycConsent" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
                {isDemo
                  ? `I authorize simulated verification for this academic demo account on the electoral roll of ${displayState} for Final Year Project assessment.`
                  : `I hereby declare that the details furnished above are true and match my valid voter registration on the electoral roll of ${displayState}.`}
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting || !consent}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <FiShield />
                  <span>Verify Identity & Activate Voting Access</span>
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CitizenVerification;
