import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

const CitizenLayout = () => (
  <div className="min-h-screen flex bg-gray-50">
    <Sidebar variant="citizen" />
    <div className="flex-1 flex flex-col min-w-0">
      <div className="lg:hidden">
        <Navbar />
      </div>
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default CitizenLayout;
