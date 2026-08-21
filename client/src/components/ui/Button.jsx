import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const variants = {
  primary: 'bg-blue-700 hover:bg-blue-800 text-white focus:ring-blue-500',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-400',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400',
  success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
  outline: 'border border-blue-600 text-blue-700 hover:bg-blue-50 focus:ring-blue-500',
};
const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({ children, variant = 'primary', size = 'md', loading = false, disabled = false, className, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    className={clsx('inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed', variants[variant], sizes[size], className)}
    disabled={disabled || loading}
    {...props}
  >
    {loading && (
      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    )}
    {children}
  </motion.button>
);

export default Button;
