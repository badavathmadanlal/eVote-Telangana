import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ fullScreen = false }) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-gray-50 z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <motion.div
        className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export default LoadingSpinner;
