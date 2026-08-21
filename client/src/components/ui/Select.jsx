import React from 'react';
import clsx from 'clsx';

const Select = React.forwardRef(({ label, error, children, className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
      ref={ref}
      className={clsx('w-full px-4 py-2 border rounded-md text-sm bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500', error ? 'border-red-400' : 'border-gray-300', className)}
      {...props}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
));
Select.displayName = 'Select';
export default Select;
