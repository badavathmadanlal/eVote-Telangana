import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ message = 'Something went wrong.' }) => (
  <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
    <FiAlertCircle size={20} />
    <span className="text-sm">{message}</span>
  </div>
);
export default ErrorMessage;
