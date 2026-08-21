import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login as loginApi, sendLoginOtp, verifyLoginOtp } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { FiLock, FiSmartphone, FiKey } from 'react-icons/fi';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('PASSWORD'); // 'PASSWORD' or 'OTP'
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  // OTP flow states
  const [otpSent, setOtpSent] = useState(false);
  const [mobileNumberForOtp, setMobileNumberForOtp] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  // Separate forms for separate tabs
  const passwordForm = useForm();
  const otpRequestForm = useForm();
  const otpVerifyForm = useForm();

  const handleApiError = (err, defaultMsg) => {
    let exactMessage = err.message || err.response?.data?.message;
    if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
      const firstErr = err.errors[0];
      exactMessage = typeof firstErr === 'string' ? firstErr : firstErr.msg || firstErr.message || exactMessage;
    }
    const finalErrorMsg = exactMessage || defaultMsg;
    setApiError(finalErrorMsg);
    toast.error(finalErrorMsg);
  };

  const onSuccess = (res) => {
    toast.success(res.message || 'Authenticated successfully');
    login(res.data.user, res.data.token);
    if (res.data.user.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/citizen/dashboard');
    }
  };

  const onPasswordSubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await loginApi(data);
      if (res.success) onSuccess(res);
    } catch (err) {
      handleApiError(err, 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const onOtpRequestSubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await sendLoginOtp({ mobileNumber: data.mobileNumber });
      if (res.success) {
        toast.success(res.message || 'OTP sent successfully');
        setMobileNumberForOtp(data.mobileNumber);
        setOtpSent(true);
      }
    } catch (err) {
      handleApiError(err, 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const onOtpVerifySubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await verifyLoginOtp({ mobileNumber: mobileNumberForOtp, otp: data.otp });
      if (res.success) onSuccess(res);
    } catch (err) {
      handleApiError(err, 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="p-8 pb-6 border-b border-slate-100 bg-slate-50/50">
        <div className="mb-2 space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded border border-blue-200">
            <FiLock className="text-xs" /> Authorized Portal Sign In
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-serif pt-1">Citizen Login</h2>
          <p className="text-xs text-slate-500">Access your digital voter profile securely</p>
        </div>

        {/* Tabs */}
        {!otpSent && (
          <div className="flex bg-slate-200/60 p-1 rounded-lg mt-6">
            <button
              onClick={() => { setActiveTab('PASSWORD'); setApiError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'PASSWORD' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <FiKey /> Password
            </button>
            <button
              onClick={() => { setActiveTab('OTP'); setApiError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'OTP' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <FiSmartphone /> Mobile OTP
            </button>
          </div>
        )}
      </div>

      <div className="p-8 pt-6">
        {/* Backend API Error Display Box */}
        {apiError && (
          <div className="mb-5">
            <ErrorMessage message={apiError} />
          </div>
        )}

        {/* PASSWORD TAB */}
        {activeTab === 'PASSWORD' && (
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <Input
              label="Registered Email or Mobile"
              type="text"
              placeholder="Email or 10-digit mobile"
              error={passwordForm.formState.errors.emailOrMobile?.message}
              {...passwordForm.register('emailOrMobile', { required: 'Email or Mobile is required' })}
            />

            <Input
              label="Account Password"
              type="password"
              placeholder="••••••••"
              error={passwordForm.formState.errors.password?.message}
              {...passwordForm.register('password', { required: 'Password is required' })}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <Link to="/forgot-password" className="text-blue-800 hover:text-blue-900 font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 mt-2">
              Secure Login
            </Button>
          </form>
        )}

        {/* OTP TAB */}
        {activeTab === 'OTP' && (
          <div>
            {!otpSent ? (
              <form onSubmit={otpRequestForm.handleSubmit(onOtpRequestSubmit)} className="space-y-4">
                <Input
                  label="Registered Mobile Number"
                  type="tel"
                  placeholder="10-digit mobile number"
                  error={otpRequestForm.formState.errors.mobileNumber?.message}
                  {...otpRequestForm.register('mobileNumber', { 
                    required: 'Mobile number is required',
                    pattern: { value: /^[6-9]\d{9}$/, message: 'Must be a valid 10-digit Indian mobile number' }
                  })}
                />
                <Button type="submit" loading={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 mt-2">
                  Send Login OTP
                </Button>
              </form>
            ) : (
              <form onSubmit={otpVerifyForm.handleSubmit(onOtpVerifySubmit)} className="space-y-4">
                <div className="bg-amber-50 text-amber-800 p-3 rounded text-xs border border-amber-200 font-medium mb-4 text-center">
                  OTP sent to {mobileNumberForOtp}
                </div>
                
                <Input
                  label="Enter 6-digit OTP"
                  type="text"
                  placeholder="• • • • • •"
                  className="text-center tracking-[1em] font-bold text-lg"
                  maxLength={6}
                  error={otpVerifyForm.formState.errors.otp?.message}
                  {...otpVerifyForm.register('otp', { 
                    required: 'OTP is required',
                    minLength: { value: 6, message: 'OTP must be 6 digits' },
                    maxLength: { value: 6, message: 'OTP must be 6 digits' }
                  })}
                />
                
                <Button type="submit" loading={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 mt-2">
                  Verify & Login
                </Button>

                <div className="text-center mt-4">
                  <button 
                    type="button" 
                    onClick={() => { setOtpSent(false); setApiError(null); otpVerifyForm.reset(); }}
                    className="text-xs text-blue-700 font-semibold hover:underline"
                  >
                    Change Mobile Number
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-800 font-bold hover:underline">
            Register New Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
