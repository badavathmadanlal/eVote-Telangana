import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-8xl font-black text-blue-700">404</h1>
        <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
        <p className="text-gray-500 text-sm">
          The requested page could not be located or you may not have authorization to view it.
        </p>
        <div>
          <Link to="/">
            <Button>Return to Safety</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
