import React from 'react';

const EmptyState = ({ icon, title = 'Nothing here', description = '', action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {icon && <div className="text-5xl text-gray-300 mb-4">{icon}</div>}
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    {description && <p className="text-sm text-gray-500 mt-1 max-w-sm">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
export default EmptyState;
