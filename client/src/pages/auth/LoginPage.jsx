import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { login as loginApi, sendLoginOtp, verifyLoginOtp } from '../../services/authService';
import AcademicDemoAccessCard from '../../components/auth/AcademicDemoAccessCard';
import toast from 'react-hot-toast';
import { 
  FiLock, 
  FiSmartphone, 
  FiKey, 
  FiShield, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiCamera, 
  FiRefreshCw, 
  FiArrowRight, 
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { MdHowToVote, MdFingerprint, MdAccountBalance } from 'react-icons/md';

const RESEND_COOLDOWN = 60; // 60s cooldown

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Mode: 'CITIZEN_LOGIN' | 'OFFICIAL_PASSWORD' | 'FACE_BOUNDARY'
  const [authMode, setAuthMode] = useState('CITIZEN_LOGIN');
  const [citizenMethod, setCitizenMethod] = useState('MOBILE'); // 'MOBILE' | 'AADHAAR'

  // Citizen OTP State Machine: 'INPUT' | 'VERIFY'
  const [otpStep, setOtpStep] = useState('INPUT');
  const [identifierInput, setIdentifierInput] = useState('');
  const [targetMobileDisplay, setTargetMobileDisplay] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // General Loading & Error State
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Refs for 6-digit OTP inputs & submission locks
  const otpInputRefs = useRef([]);
  const isSendingOtpRef = useRef(false);
  const isVerifyingOtpRef = useRef(false);

  // Official Password Form
  const passwordForm = useForm();

  // Countdown timer effect
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
    const finalErrorMsg = exactMessage || defaultMsg;
    setApiError(finalErrorMsg);
    setOtpError(finalErrorMsg);
    toast.error(finalErrorMsg);
  };

  const onSuccess = (res) => {
    toast.success(res.message || 'Authentication successful');
    const user = res.data?.user || res.user;
    const token = res.data?.token || res.token;
    login(user, token);
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/citizen/dashboard');
    }
  };

  // 1. Send OTP Handler with Atomic Mutex Lock
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (isSendingOtpRef.current || loading) return;

    setApiError(null);
    setOtpError('');

    const cleanInput = identifierInput.replace(/\D/g, '');
    if (!cleanInput) {
      setApiError(citizenMethod === 'MOBILE' ? 'Please enter your 10-digit mobile number' : 'Please enter your 12-digit Aadhaar number');
      return;
    }

    if (citizenMethod === 'MOBILE' && cleanInput.length !== 10) {
      setApiError('Mobile number must be exactly 10 digits');
      return;
    }

    if (citizenMethod === 'AADHAAR' && cleanInput.length !== 12) {
      setApiError('Aadhaar number must be exactly 12 digits');
      return;
    }

    isSendingOtpRef.current = true;
    try {
      setLoading(true);
      const res = await sendLoginOtp({ mobileNumber: cleanInput });
      if (res && (res.success || res.status === 'success' || res.message)) {
        toast.success(res.message || 'OTP sent to registered mobile number');
        setTargetMobileDisplay(res.data?.targetMobile || (cleanInput.length >= 10 ? `●●●●●●${cleanInput.slice(-4)}` : cleanInput));
        setOtpStep('VERIFY');
        setCooldown(RESEND_COOLDOWN);
        
        // If it's a demo account, autofill 123456 for effortless demo experience
        if (res.data?.isDemo || res.isDemo || cleanInput.startsWith('900000000') || cleanInput.startsWith('123456789')) {
          setOtpValues(['1', '2', '3', '4', '5', '6']);
        } else {
          setOtpValues(['', '', '', '', '', '']);
        }
        setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
      }
    } catch (err) {
      handleApiError(err, 'Failed to send OTP. Please check your details or register first.');
    } finally {
      setLoading(false);
      isSendingOtpRef.current = false;
    }
  };

  // 2. Handle OTP digit inputs
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

  // 3. Verify OTP Handler with Atomic Mutex Lock
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (isVerifyingOtpRef.current || loading) return;

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

    const cleanInput = identifierInput.replace(/\D/g, '');

    isVerifyingOtpRef.current = true;
    try {
      setLoading(true);
      setAttempts(prev => prev + 1);
      const res = await verifyLoginOtp({
        mobileNumber: cleanInput,
        otp: otpCode
      });
      if (res && (res.success || res.status === 'success')) {
        onSuccess(res);
      }
    } catch (err) {
      handleApiError(err, 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
      isVerifyingOtpRef.current = false;
    }
  };

  // 4. Official Password Login
  const onPasswordSubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await loginApi(data);
      if (res && (res.success || res.status === 'success')) {
        onSuccess(res);
      }
    } catch (err) {
      handleApiError(err, 'Authentication failed. Please check your official credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick select demo account
  const handleSelectDemoAccount = (mobile) => {
    setAuthMode('CITIZEN_LOGIN');
    setCitizenMethod('MOBILE');
    setIdentifierInput(mobile);
    setOtpStep('INPUT');
    setApiError(null);
    setOtpError('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      
      {/* LEFT COLUMN: Main Citizen / Official Login Form (lg: 7 cols) */}
      <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
        
        {/* Header Banner */}
        <div className="p-6 sm:p-8 pb-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <MdAccountBalance className="text-base" />
              <span>State Election Commission Portal</span>
            </div>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
              TLS 1.3 SECURE
            </span>
          </div>

          <h2 className="text-2xl font-black font-serif text-white">
            {authMode === 'OFFICIAL_PASSWORD' ? 'Official / Officer Login' : 'Citizen Voter Sign In'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {authMode === 'OFFICIAL_PASSWORD'
              ? 'Administrative sign-in for Returning Officers and Observer staff'
              : 'Fast, secure OTP verification for registered electors'}
          </p>

          {/* Primary Tab Switcher */}
          <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1.5 rounded-2xl mt-5 border border-slate-800/80">
            <button
              type="button"
              onClick={() => { setAuthMode('CITIZEN_LOGIN'); setApiError(null); }}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                authMode === 'CITIZEN_LOGIN' || authMode === 'FACE_BOUNDARY'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MdHowToVote /> Citizen OTP Sign In
            </button>

            <button
              type="button"
              onClick={() => { setAuthMode('OFFICIAL_PASSWORD'); setApiError(null); }}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                authMode === 'OFFICIAL_PASSWORD'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiLock /> Official / Admin
            </button>
          </div>
        </div>

        {/* Main Form Body */}
        <div className="p-6 sm:p-8 pt-6 space-y-6">
          
          {/* Error Alert Box */}
          {apiError && (
            <div className="bg-red-950/80 border border-red-800 text-red-200 p-3.5 rounded-2xl text-xs flex items-start gap-2.5">
              <FiAlertCircle className="text-red-400 text-base shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{apiError}</div>
            </div>
          )}

          {/* CITIZEN LOGIN FLOW */}
          {(authMode === 'CITIZEN_LOGIN' || authMode === 'FACE_BOUNDARY') && (
            <div className="space-y-5">
              
              {otpStep === 'INPUT' && (
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => { setCitizenMethod('MOBILE'); setAuthMode('CITIZEN_LOGIN'); setIdentifierInput(''); }}
                    className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      citizenMethod === 'MOBILE' && authMode === 'CITIZEN_LOGIN' ? 'bg-slate-800 text-amber-400 shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FiSmartphone size={13} /> Mobile OTP
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCitizenMethod('AADHAAR'); setAuthMode('CITIZEN_LOGIN'); setIdentifierInput(''); }}
                    className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      citizenMethod === 'AADHAAR' && authMode === 'CITIZEN_LOGIN' ? 'bg-slate-800 text-amber-400 shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MdFingerprint size={15} /> Aadhaar OTP
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('FACE_BOUNDARY')}
                    className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      authMode === 'FACE_BOUNDARY' ? 'bg-slate-800 text-amber-400 shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FiCamera size={13} /> Face Match
                  </button>
                </div>
              )}

              {/* Face Match Notice */}
              {authMode === 'FACE_BOUNDARY' && (
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4">
                  <div className="relative w-24 h-24 mx-auto rounded-2xl bg-slate-900 border-2 border-dashed border-amber-400/60 flex items-center justify-center overflow-hidden">
                    <FiCamera className="text-3xl text-slate-500" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Biometric Face Authentication</h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                      Face authentication is an upcoming feature requiring a certified Election Commission camera terminal. For remote browser sign-in, please authenticate using Mobile or Aadhaar OTP.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setAuthMode('CITIZEN_LOGIN'); setCitizenMethod('MOBILE'); }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Proceed with Mobile OTP
                  </button>
                </div>
              )}

              {/* OTP FLOW */}
              {authMode === 'CITIZEN_LOGIN' && (
                <>
                  {/* STEP 1: Enter Number */}
                  {otpStep === 'INPUT' && (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          {citizenMethod === 'MOBILE' ? '10-Digit Mobile Number *' : '12-Digit Aadhaar Number *'}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            {citizenMethod === 'MOBILE' ? <FiSmartphone className="text-amber-400" /> : <MdFingerprint className="text-lg text-amber-400" />}
                          </div>
                          <input
                            type="text"
                            value={identifierInput}
                            onChange={(e) => setIdentifierInput(e.target.value)}
                            placeholder={citizenMethod === 'MOBILE' ? '10-digit mobile number' : '12-digit Aadhaar number'}
                            maxLength={citizenMethod === 'MOBILE' ? 10 : 12}
                            required
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-mono placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none tracking-wide"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {citizenMethod === 'MOBILE'
                            ? 'A 6-digit OTP will be dispatched to this mobile number.'
                            : 'A 6-digit OTP will be dispatched to your Aadhaar-linked mobile number.'}
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || !identifierInput.trim()}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black py-3.5 px-6 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                            <span>Connecting to OTP Gateway...</span>
                          </>
                        ) : (
                          <>
                            <FiSmartphone />
                            <span>Send Login OTP</span>
                            <FiArrowRight />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* STEP 2: Verify OTP */}
                  {otpStep === 'VERIFY' && (
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
                        <p className="text-xs text-slate-300">
                          Enter the 6-digit verification code dispatched to:
                        </p>
                        <p className="text-sm font-mono font-bold text-amber-400 tracking-wider">
                          {targetMobileDisplay || identifierInput}
                        </p>
                        {identifierInput.startsWith('123456789') && (
                          <p className="text-[10px] text-amber-300 font-semibold bg-amber-400/10 py-1 px-2 rounded-lg mt-1 border border-amber-400/20">
                            Academic Demo Account: Use OTP <strong>123456</strong>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                          6-Digit Security OTP
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
                            <span>Verifying OTP...</span>
                          </>
                        ) : (
                          <>
                            <FiCheckCircle />
                            <span>Verify & Sign In</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => { setOtpStep('INPUT'); setApiError(null); setOtpError(''); }}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          ← Change Number
                        </button>

                        {cooldown > 0 ? (
                          <span className="text-slate-500 font-mono text-xs">
                            Resend in <strong className="text-amber-400">{cooldown}s</strong>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                          >
                            <FiRefreshCw size={12} /> Resend OTP
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </>
              )}

            </div>
          )}

          {/* OFFICIAL ADMIN PASSWORD FLOW */}
          {authMode === 'OFFICIAL_PASSWORD' && (
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Official Email or ID *
                </label>
                <input
                  type="text"
                  placeholder="admin@ceotelangana.nic.in"
                  {...passwordForm.register('emailOrMobile', { required: 'Official ID or Email is required' })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                {passwordForm.formState.errors.emailOrMobile && (
                  <p className="text-[11px] text-red-400 mt-1">{passwordForm.formState.errors.emailOrMobile.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Security Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    {...passwordForm.register('password', { required: 'Password is required' })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
                {passwordForm.formState.errors.password && (
                  <p className="text-[11px] text-red-400 mt-1">{passwordForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <Link to="/forgot-password" className="text-amber-400 hover:text-amber-300 font-semibold hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <FiLock />
                    <span>Sign In as Official</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Link */}
          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            New voter in Telangana?{' '}
            <Link to="/register" className="text-amber-400 font-bold hover:underline">
              Register as Citizen
            </Link>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: Academic Demo Access Card (lg: 5 cols, sits neatly beside form) */}
      <div className="lg:col-span-5 w-full">
        <AcademicDemoAccessCard 
          onSelectAccount={handleSelectDemoAccount} 
          activeMobile={identifierInput}
        />
      </div>

    </div>
  );
};

export default LoginPage;
