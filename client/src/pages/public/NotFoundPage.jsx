import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b1a] text-white px-4 text-center">
      <div className="space-y-6 max-w-md bg-[#0a1428] p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <h1 className="text-8xl font-black text-blue-500 font-serif">404</h1>
        <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
        <p className="text-slate-400 text-sm">
          The requested page could not be located or you may not have authorization to view it.
        </p>
        <div>
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl text-sm">
              Return to Safety
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
