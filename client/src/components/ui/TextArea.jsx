import React from 'react';
import clsx from 'clsx';

const TextArea = React.forwardRef(({ label, error, className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <textarea
      ref={ref}
      rows={4}
      className={clsx('w-full px-4 py-2 border rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none', error ? 'border-red-400 bg-red-50' : 'border-gray-300', className)}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
));
TextArea.displayName = 'TextArea';
export default TextArea;
