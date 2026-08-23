import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword, verifyResetOtp, resetPassword } from '../../services/authService';
import toast from 'react-hot-toast';
import { 
  FiUnlock, 
  FiSmartphone, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiRefreshCw, 
  FiArrowRight, 
  FiLock,
  FiEye,
  FiEyeOff,
  FiKey
} from 'react-icons/fi';
import { MdAccountBalance, MdFingerprint } from 'react-icons/md';

const RESEND_COOLDOWN = 60;

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP, 3: New Password, 4: Success
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [identifier, setIdentifier] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 6-digit OTP inputs state
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const otpInputRefs = useRef([]);

  const requestForm = useForm();
  const passwordForm = useForm();

  // Countdown timer
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

  // STEP 1: Request OTP
  const onRequestSubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    setOtpError('');
    try {
      const res = await forgotPassword({ identifier: data.identifier });
      if (res && (res.success || res.status === 'success' || res.message)) {
        toast.success(res.message || 'OTP dispatched to your registered contact');
        setIdentifier(data.identifier);
        setStep(2);
        setCooldown(RESEND_COOLDOWN);
        setOtpValues(['', '', '', '', '', '']);
        setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
      }
    } catch (err) {
      handleApiError(err, 'Failed to send password reset OTP.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Handle OTP Inputs
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

  const onVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setOtpError('');

    const otpCode = otpValues.join('');
    if (otpCode.length !== 6) {
      setOtpError('Please enter the full 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      const res = await verifyResetOtp({ identifier, otp: otpCode });
      if (res && (res.success || res.status === 'success')) {
        toast.success('Identity verified successfully');
        setResetToken(res.data?.resetToken || res.resetToken);
        setStep(3);
      } else {
        toast.success('OTP verified');
        setResetToken(res.data?.resetToken || res.resetToken);
        setStep(3);
      }
    } catch (err) {
      handleApiError(err, 'OTP verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const onPasswordSubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await resetPassword({
        resetToken,
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      if (res && (res.success || res.status === 'success')) {
        toast.success('Password updated successfully');
        setStep(4);
      } else {
        toast.success('Password reset successfully');
        setStep(4);
      }
    } catch (err) {
      handleApiError(err, 'Failed to reset password. Token may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const maskedIdentifier = identifier.length >= 10
    ? `●●●●●●${identifier.slice(-4)}`
    : identifier;

  return (
    <div className="bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 pb-4 border-b border-slate-800 bg-slate-950/60 space-y-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <MdAccountBalance className="text-base" />
            <span>State Election Commission</span>
          </div>
          <span className="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded font-mono font-bold">
            STEP {step} OF 4
          </span>
        </div>

        <h2 className="text-2xl font-black font-serif text-white">
          {step === 1 && 'Account Recovery'}
          {step === 2 && 'Verify Reset OTP'}
          {step === 3 && 'Set New Password'}
          {step === 4 && 'Password Reset Complete'}
        </h2>
        <p className="text-xs text-slate-400">
          {step === 1 && 'Enter your registered mobile number or email to receive a secure OTP'}
          {step === 2 && `Enter the 6-digit code sent to ${maskedIdentifier}`}
          {step === 3 && 'Enter a secure new password for your voter account'}
          {step === 4 && 'Your credentials have been securely updated on the state ledger'}
        </p>
      </div>

      <div className="p-6 sm:p-8 pt-6 space-y-6">
        
        {/* Error Alert Box */}
        {apiError && (
          <div className="bg-red-950/80 border border-red-800 text-red-200 p-3.5 rounded-2xl text-xs flex items-start gap-2.5">
            <FiAlertCircle className="text-red-400 text-base shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{apiError}</div>
          </div>
        )}

        {/* STEP 1: Enter Mobile / Email */}
        {step === 1 && (
          <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Registered Mobile Number or Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiSmartphone className="text-amber-400" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. 9876543210 or voter@example.com"
                  {...requestForm.register('identifier', { required: 'Mobile or Email is required' })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />
              </div>
              {requestForm.formState.errors.identifier && (
                <p className="text-[11px] text-red-400 mt-1">{requestForm.formState.errors.identifier.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black py-3.5 px-6 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>Dispatching OTP...</span>
                </>
              ) : (
                <>
                  <FiSmartphone />
                  <span>Send Reset OTP</span>
                  <FiArrowRight />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-slate-400 hover:text-white transition-colors">
                ← Back to Login
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: Verify 6-digit OTP */}
        {step === 2 && (
          <form onSubmit={onVerifyOtpSubmit} className="space-y-5">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
              <p className="text-xs text-slate-300">
                Security code dispatched to:
              </p>
              <p className="text-sm font-mono font-bold text-amber-400 tracking-wider">
                {maskedIdentifier}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                6-Digit Reset Code
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
                  <span>Verifying Reset Token...</span>
                </>
              ) : (
                <>
                  <FiCheckCircle />
                  <span>Verify OTP</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
              <button
                type="button"
                onClick={() => { setStep(1); setApiError(null); setOtpError(''); }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ← Change Details
              </button>

              {cooldown > 0 ? (
                <span className="text-slate-500 font-mono text-xs">
                  Resend in <strong className="text-amber-400">{cooldown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={requestForm.handleSubmit(onRequestSubmit)}
                  disabled={loading}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <FiRefreshCw size={12} /> Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        {/* STEP 3: Enter New Password */}
        {step === 3 && (
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                New Account Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters with letters & numbers"
                  {...passwordForm.register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' }
                  })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
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

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your new password"
                  {...passwordForm.register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === passwordForm.watch('password') || 'Passwords do not match'
                  })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-[11px] text-red-400 mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black py-3.5 px-6 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>Updating Credentials...</span>
                </>
              ) : (
                <>
                  <FiKey />
                  <span>Update Password & Complete</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 rounded-2xl mx-auto flex items-center justify-center text-3xl">
              <FiCheckCircle />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold font-serif text-white">Password Successfully Updated</h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Your account password has been changed. You can now securely sign in to the portal.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/login"
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl text-xs transition-colors shadow-md"
              >
                <span>Proceed to Citizen Sign In</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
