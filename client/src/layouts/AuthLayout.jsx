import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { MdHowToVote } from 'react-icons/md';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/citizen/dashboard'} replace />;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white p-12">
        <div className="flex items-center gap-3">
          <MdHowToVote size={40} />
          <div>
            <p className="text-xl font-bold leading-tight">eVote Telangana</p>
            <p className="text-sm text-blue-200">Election Commission Portal</p>
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">Your Vote,<br />Your Voice,<br />Your Future.</h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Participate in shaping Telangana's democracy with our secure, transparent, and accessible remote voting platform.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[['Secure', 'End-to-end encrypted voting'], ['Transparent', 'Open & auditable process'], ['Accessible', 'Vote from anywhere'], ['Official', 'Govt. certified portal']].map(([title, desc]) => (
              <div key={title} className="bg-white/10 rounded-lg p-4">
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-blue-200 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-blue-300">© {new Date().getFullYear()} Government of Telangana</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <MdHowToVote className="text-blue-700 text-3xl" />
            <p className="text-xl font-bold text-gray-900">eVote Telangana</p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
