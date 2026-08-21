import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgotPassword, verifyResetOtp, resetPassword } from '../../services/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { FiUnlock, FiMail, FiSmartphone, FiKey, FiCheckCircle } from 'react-icons/fi';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Request, 2: OTP, 3: New Password, 4: Success
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  const [identifier, setIdentifier] = useState('');
  const [resetToken, setResetToken] = useState('');

  const navigate = useNavigate();

  const requestForm = useForm();
  const otpForm = useForm();
  const passwordForm = useForm();

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

  const onRequestSubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await forgotPassword({ identifier: data.identifier });
      if (res.success) {
        toast.success(res.message || 'OTP sent successfully');
        setIdentifier(data.identifier);
        setStep(2);
      }
    } catch (err) {
      handleApiError(err, 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const onOtpSubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await verifyResetOtp({ identifier, otp: data.otp });
      if (res.success) {
        toast.success(res.message || 'OTP verified');
        setResetToken(res.data.resetToken);
        setStep(3);
      }
    } catch (err) {
      handleApiError(err, 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await resetPassword({ resetToken, password: data.password, confirmPassword: data.confirmPassword });
      if (res.success) {
        toast.success(res.message || 'Password reset successfully');
        setStep(4);
      }
    } catch (err) {
      handleApiError(err, 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
      
      {/* Header */}
      <div className="mb-6 space-y-1">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded border border-blue-200">
          <FiUnlock className="text-xs" /> Account Recovery
        </div>
        <h2 className="text-2xl font-black text-slate-900 font-serif pt-1">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify Identity"}
          {step === 3 && "Create New Password"}
          {step === 4 && "Recovery Complete"}
        </h2>
        <p className="text-xs text-slate-500">
          {step === 1 && "Enter your registered email or mobile to receive an OTP"}
          {step === 2 && `Enter the 6-digit OTP sent to ${identifier}`}
          {step === 3 && "Set a strong password for your account"}
          {step === 4 && "Your password has been securely updated"}
        </p>
      </div>

      {apiError && (
        <div className="mb-5">
          <ErrorMessage message={apiError} />
        </div>
      )}

      {/* STEP 1: Request OTP */}
      {step === 1 && (
        <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
          <Input
            label="Email Address or Mobile Number"
            type="text"
            placeholder="name@example.com or 10-digit mobile"
            error={requestForm.formState.errors.identifier?.message}
            {...requestForm.register('identifier', { required: 'Email or Mobile is required' })}
          />
          <Button type="submit" loading={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 mt-2">
            Send Reset OTP
          </Button>
          <div className="text-center mt-4">
            <Link to="/login" className="text-xs text-blue-700 font-semibold hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      )}

      {/* STEP 2: Verify OTP */}
      {step === 2 && (
        <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
          <div className="bg-amber-50 text-amber-800 p-3 rounded text-xs border border-amber-200 font-medium mb-4 text-center">
            OTP sent to {identifier}
          </div>
          <Input
            label="Enter 6-digit OTP"
            type="text"
            placeholder="• • • • • •"
            className="text-center tracking-[1em] font-bold text-lg"
            maxLength={6}
            error={otpForm.formState.errors.otp?.message}
            {...otpForm.register('otp', { 
              required: 'OTP is required',
              minLength: { value: 6, message: 'OTP must be 6 digits' },
              maxLength: { value: 6, message: 'OTP must be 6 digits' }
            })}
          />
          <Button type="submit" loading={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 mt-2">
            Verify OTP
          </Button>
          <div className="text-center mt-4 flex justify-between px-2">
            <button type="button" onClick={() => { setStep(1); setApiError(null); }} className="text-xs text-blue-700 font-semibold hover:underline">
              Change Details
            </button>
            <button type="button" onClick={requestForm.handleSubmit(onRequestSubmit)} className="text-xs text-blue-700 font-semibold hover:underline">
              Resend OTP
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: New Password */}
      {step === 3 && (
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={passwordForm.formState.errors.password?.message}
            {...passwordForm.register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' }
            })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            error={passwordForm.formState.errors.confirmPassword?.message}
            {...passwordForm.register('confirmPassword', {
              required: 'Confirm Password is required',
              validate: value => value === passwordForm.watch('password') || 'Passwords do not match'
            })}
          />
          <Button type="submit" loading={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 mt-2">
            Reset Password
          </Button>
        </form>
      )}

      {/* STEP 4: Success */}
      {step === 4 && (
        <div className="text-center py-6 space-y-6">
          <div className="flex justify-center">
            <FiCheckCircle className="text-6xl text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Password Updated</h3>
            <p className="text-sm text-slate-500">You can now securely login with your new credentials.</p>
          </div>
          <Link to="/login" className="inline-block w-full">
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5">
              Proceed to Login
            </Button>
          </Link>
        </div>
      )}

    </div>
  );
};

export default ForgotPasswordPage;
