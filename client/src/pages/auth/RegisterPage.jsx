import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as registerApi, sendLoginOtp, verifyLoginOtp } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import AcademicDemoAccessCard from '../../components/auth/AcademicDemoAccessCard';
import { 
  FiUserPlus, 
  FiPhone, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiArrowRight, 
  FiMessageSquare,
  FiRefreshCw,
  FiInfo
} from 'react-icons/fi';
import { MdAccountBalance, MdFingerprint, MdHowToVote } from 'react-icons/md';

const RESEND_COOLDOWN = 60;

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Registration vs OTP Verification State: 'FORM' | 'OTP_VERIFY'
  const [step, setStep] = useState('FORM');
  const [registeredMobile, setRegisteredMobile] = useState('');
  const [targetMobileDisplay, setTargetMobileDisplay] = useState('');

  // 6-digit OTP state
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [demoNotice, setDemoNotice] = useState(false);

  const otpInputRefs = useRef([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      consent: true,
    }
  });

  const currentMobile = watch('mobileNumber');

  // Check if current input is a demo number
  useEffect(() => {
    const clean = String(currentMobile || '').trim().replace(/\D/g, '');
    if (clean === '1234567890' || clean === '1234567891') {
      setDemoNotice(true);
      setApiError(null);
    } else {
      setDemoNotice(false);
    }
  }, [currentMobile]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleApiError = (err, defaultMsg) => {
    let exactMessage = err.message || err.response?.data?.message;
    if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
      const firstErr = err.errors[0];
      exactMessage = typeof firstErr === 'string' ? firstErr : firstErr.msg || firstErr.message || exactMessage;
    }

    // Friendly demo account detection
    if (exactMessage && exactMessage.toLowerCase().includes('academic demo account')) {
      setDemoNotice(true);
      setApiError(null);
      return;
    }

    const finalErrorMsg = exactMessage || defaultMsg;
    setApiError(finalErrorMsg);
    setOtpError(finalErrorMsg);
    toast.error(finalErrorMsg);
  };

  // 1. Submit Registration
  const onRegisterSubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    setOtpError('');
    setDemoNotice(false);

    const cleanMobile = data.mobileNumber ? data.mobileNumber.replace(/\D/g, '') : '';
    const cleanAadhaar = data.aadhaar ? data.aadhaar.replace(/\D/g, '') : '';
    const cleanWhatsApp = data.whatsappNumber ? data.whatsappNumber.replace(/\D/g, '') : '';

    // Direct check for demo numbers
    if (cleanMobile === '1234567890' || cleanMobile === '1234567891') {
      setDemoNotice(true);
      setLoading(false);
      return;
    }

    if (!cleanMobile && !cleanAadhaar) {
      setApiError('Please provide either a Mobile Number or an Aadhaar Number');
      setLoading(false);
      return;
    }

    if (!data.consent) {
      setApiError('Please accept the citizen declaration to proceed');
      setLoading(false);
      return;
    }

    try {
      const res = await registerApi({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        mobileNumber: cleanMobile || undefined,
        aadhaar: cleanAadhaar || undefined,
        whatsappNumber: cleanWhatsApp || undefined,
        email: data.email?.trim() || undefined,
      });

      if (res && (res.success || res.status === 'success' || res.data?.user || res.user)) {
        toast.success(res.message || 'Voter profile created successfully!');
        
        if (cleanMobile) {
          setRegisteredMobile(cleanMobile);
          setTargetMobileDisplay(res.data?.targetMobile || `●●●●●●${cleanMobile.slice(-4)}`);
          setStep('OTP_VERIFY');
          setCooldown(RESEND_COOLDOWN);
          setOtpValues(['', '', '', '', '', '']);
          setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
        } else {
          navigate('/login');
        }
      }
    } catch (err) {
      handleApiError(err, 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle OTP digit input changes
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1);
    setOtpValues(newOtp);
    setOtpError('');

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpValues(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  // 3. Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0 || !registeredMobile) return;
    setLoading(true);
    setApiError(null);
    setOtpError('');

    try {
      const res = await sendLoginOtp({ mobileNumber: registeredMobile });
      if (res && (res.success || res.status === 'success' || res.message)) {
        toast.success('Verification OTP resent successfully');
        setCooldown(RESEND_COOLDOWN);
        setOtpValues(['', '', '', '', '', '']);
        setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
      }
    } catch (err) {
      handleApiError(err, 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // 4. Verify OTP & Complete Login
  const onVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setOtpError('');

    const otpCode = otpValues.join('');
    if (otpCode.length !== 6) {
      setOtpError('Please enter the complete 6-digit OTP');
      return;
    }

    if (attempts >= 3) {
      setOtpError('Maximum verification attempts exceeded. Please request a new OTP.');
      return;
    }

    try {
      setLoading(true);
      setAttempts(prev => prev + 1);
      const res = await verifyLoginOtp({
        mobileNumber: registeredMobile,
        otp: otpCode,
      });

      if (res && (res.success || res.status === 'success')) {
        toast.success('Mobile verified and logged in successfully!');
        const user = res.data?.user || res.user;
        const token = res.data?.token || res.token;
        login(user, token);
        navigate('/citizen/dashboard');
      }
    } catch (err) {
      handleApiError(err, 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // When demo account is selected from card on register page -> navigate to login with that demo account
  const handleSelectDemoAccount = (mobile) => {
    navigate('/login');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      
      {/* LEFT COLUMN: Main Citizen Registration Form (lg: 7 cols) */}
      <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
        
        {/* Header Banner */}
        <div className="p-6 sm:p-8 pb-4 border-b border-slate-800 bg-slate-950/60 space-y-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <MdAccountBalance className="text-base" />
              <span>State Election Commission</span>
            </div>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
              CITIZEN ELECTOR
            </span>
          </div>

          <h2 className="text-2xl font-black font-serif text-white">
            {step === 'FORM' ? 'Citizen Voter Registration' : 'Verify Mobile OTP'}
          </h2>
          <p className="text-xs text-slate-400">
            {step === 'FORM'
              ? 'Simple one-step registration for rural and urban electors using Mobile or Aadhaar OTP'
              : 'Enter the 6-digit verification code to activate your voter account'}
          </p>
        </div>

        <div className="p-6 sm:p-8 pt-6 space-y-5">
          
          {/* Friendly Demo Notice */}
          {demoNotice && (
            <div className="bg-amber-950/80 border border-amber-500/60 text-amber-200 p-4 rounded-2xl text-xs space-y-2">
              <div className="flex items-start gap-2">
                <FiInfo className="text-amber-400 text-base shrink-0 mt-0.5" />
                <p className="font-semibold leading-relaxed">
                  This is an academic demo account. Please use Citizen Login to access it.
                </p>
              </div>
              <div className="pt-1">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors shadow-sm"
                >
                  Go to Citizen Login <FiArrowRight size={13} />
                </Link>
              </div>
            </div>
          )}

          {/* Error Alert Box */}
          {apiError && (
            <div className="bg-red-950/80 border border-red-800 text-red-200 p-3.5 rounded-2xl text-xs flex items-start gap-2.5">
              <FiAlertCircle className="text-red-400 text-base shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{apiError}</div>
            </div>
          )}

          {/* STEP 1: Registration Form */}
          {step === 'FORM' && (
            <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4 text-xs">
              
              {/* Name Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">First Name *</label>
                  <input
                    type="text"
                    placeholder="First name"
                    {...register('firstName', { required: 'First name is required' })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  />
                  {errors.firstName && <p className="text-[11px] text-red-400 mt-1">{errors.firstName.message}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Last Name *</label>
                  <input
                    type="text"
                    placeholder="Surname / Last name"
                    {...register('lastName', { required: 'Last name is required' })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  />
                  {errors.lastName && <p className="text-[11px] text-red-400 mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Mobile Number (Primary) */}
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  Mobile Number (For OTP Verification) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiPhone className="text-amber-400" />
                  </div>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    {...register('mobileNumber', {
                      pattern: { value: /^\d{10}$/, message: 'Must be a valid 10-digit mobile number' }
                    })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                {errors.mobileNumber && <p className="text-[11px] text-red-400 mt-1">{errors.mobileNumber.message}</p>}
              </div>

              {/* Aadhaar Number (Optional) */}
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  Aadhaar Number (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MdFingerprint className="text-base text-amber-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="12-digit Aadhaar number"
                    maxLength={12}
                    {...register('aadhaar', {
                      pattern: { value: /^\d{12}$/, message: 'Aadhaar must be exactly 12 digits' }
                    })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                {errors.aadhaar && <p className="text-[11px] text-red-400 mt-1">{errors.aadhaar.message}</p>}
              </div>

              {/* WhatsApp Number (Optional) */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  WhatsApp Number (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiMessageSquare className="text-emerald-400" />
                  </div>
                  <input
                    type="tel"
                    placeholder="10-digit WhatsApp number"
                    maxLength={10}
                    {...register('whatsappNumber', {
                      pattern: { value: /^\d{10}$/, message: 'Must be a valid 10-digit mobile number' }
                    })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Used for voting receipts and important notifications.
                </p>
              </div>

              {/* Citizen Consent Checkbox */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-2.5 mt-2">
                <input
                  type="checkbox"
                  id="citizenConsent"
                  {...register('consent', { required: 'Declaration consent is required' })}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-700 bg-slate-900"
                />
                <label htmlFor="citizenConsent" className="text-[11px] text-slate-300 leading-relaxed cursor-pointer select-none">
                  I declare that I am an Indian citizen eligible to vote in Telangana. I authorize one-time mobile OTP authentication for remote voter sign in.
                </label>
              </div>
              {errors.consent && <p className="text-[11px] text-red-400">{errors.consent.message}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black py-3.5 px-6 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 mt-3"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>Registering & Dispathing OTP...</span>
                  </>
                ) : (
                  <>
                    <FiUserPlus />
                    <span>Register & Proceed to OTP Sign In</span>
                    <FiArrowRight />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP Verification Screen */}
          {step === 'OTP_VERIFY' && (
            <form onSubmit={onVerifyOtpSubmit} className="space-y-5">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
                <p className="text-xs text-slate-300">
                  Enter the 6-digit verification code dispatched to:
                </p>
                <p className="text-sm font-mono font-bold text-amber-400 tracking-wider">
                  {targetMobileDisplay || registeredMobile}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  6-Digit Verification OTP
                </label>
                <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      ref={el => otpInputRefs.current[idx] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-mono font-black bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 rounded-xl text-white outline-none transition-all"
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-center text-[11px] text-red-400 font-semibold mt-1">
                    {otpError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otpValues.join('').length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Verifying OTP & Logging In...</span>
                  </>
                ) : (
                  <>
                    <FiCheckCircle />
                    <span>Verify OTP & Enter Citizen Portal</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setStep('FORM'); setApiError(null); setOtpError(''); }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ← Back to Edit Form
                </button>

                {cooldown > 0 ? (
                  <span className="text-slate-500 font-mono text-xs">
                    Resend in <strong className="text-amber-400">{cooldown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                  >
                    <FiRefreshCw size={12} /> Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}

          <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
            Already registered on the electoral roll?{' '}
            <Link to="/login" className="text-amber-400 font-bold hover:underline">
              Sign In with OTP
            </Link>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: Small Academic Demo Access Card (lg: 5 cols) */}
      <div className="lg:col-span-5 w-full">
        <AcademicDemoAccessCard 
          onSelectAccount={handleSelectDemoAccount} 
          activeMobile={currentMobile}
        />
      </div>

    </div>
  );
};

export default RegisterPage;
