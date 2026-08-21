import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as registerApi } from '../../services/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { FiUserPlus } from 'react-icons/fi';

const RegisterPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await registerApi({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      if (res.success) {
        toast.success(res.message || 'Registration successful! Please login.');
        navigate('/login');
      }
    } catch (err) {
      // Extract exact backend validation error message
      let exactMessage = err.message || err.response?.data?.message;

      // Handle array of validation errors from backend if returned in err.errors
      if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        const firstErr = err.errors[0];
        exactMessage = typeof firstErr === 'string' ? firstErr : firstErr.msg || firstErr.message || exactMessage;
      }

      const finalErrorMsg = exactMessage || 'Registration failed. Please check your details.';
      setApiError(finalErrorMsg);
      toast.error(finalErrorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
      {/* Header */}
      <div className="mb-6 space-y-1">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded border border-blue-200">
          <FiUserPlus className="text-xs" /> Citizen Account Registration
        </div>
        <h2 className="text-2xl font-black text-slate-900 font-serif">Create Voter Account</h2>
        <p className="text-xs text-slate-500">Register to access remote voting and election services</p>
      </div>

      {/* Backend API Error Display Box */}
      {apiError && (
        <div className="mb-5">
          <ErrorMessage message={apiError} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name & Last Name Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            placeholder="John"
            error={errors.firstName?.message}
            {...register('firstName', { required: 'First name is required' })}
          />

          <Input
            label="Last Name"
            type="text"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName', { required: 'Last name is required' })}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email address is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address format' }
          })}
        />

        <Input
          label="Mobile Number"
          type="tel"
          placeholder="10-digit mobile number"
          error={errors.mobileNumber?.message}
          {...register('mobileNumber', {
            required: 'Mobile number is required',
            pattern: { value: /^[6-9]\d{9}$/, message: 'Must be a valid 10-digit Indian mobile number' }
          })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' }
            })}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Confirm Password is required',
              validate: value => value === password || 'Passwords do not match'
            })}
          />
        </div>

        <Button type="submit" loading={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 mt-2">
          Complete Registration
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        Already registered?{' '}
        <Link to="/login" className="text-amber-800 font-bold hover:underline">
          Sign In here
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
