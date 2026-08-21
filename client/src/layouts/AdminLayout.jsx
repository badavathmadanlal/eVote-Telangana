import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const AdminLayout = () => (
  <div className="min-h-screen flex bg-gray-100">
    <Sidebar variant="admin" />
    <div className="flex-1 flex flex-col min-w-0">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Administrator</span>
      </header>
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;
