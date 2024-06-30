import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { FaBars } from 'react-icons/fa';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="md:hidden fixed top-0 left-0 p-4">
        <button onClick={toggleSidebar}>
          <FaBars className="text-2xl text-black" />
        </button>
      </div>
      <div className="fixed z-40 shadow-2xl border">
        <AdminSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div className="flex-1 p-10 transition-all duration-300 overflow-y-auto md:pl-72 pr-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
