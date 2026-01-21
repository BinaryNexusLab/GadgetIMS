import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  BarChart3,
  Package,
  ShoppingCart,
  Truck,
  Users,
  AlertCircle,
  FileText,
  Settings,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: BarChart3 },
    { label: 'Daily Sale', path: '/daily-sale', icon: ShoppingCart },
    { label: 'Products', path: '/products', icon: Package },
    { label: 'Sales', path: '/sales', icon: ShoppingCart },
    { label: 'Purchases', path: '/purchases', icon: Truck },
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'Suppliers', path: '/suppliers', icon: Truck },
    { label: 'Inventory Alerts', path: '/alerts', icon: AlertCircle },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo/Header */}
        <div className='p-4 border-b border-slate-700'>
          <div className='flex items-center justify-between'>
            <h1 className={`font-bold text-lg ${!sidebarOpen && 'hidden'}`}>
              GadgetIMS
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className='p-1 hover:bg-slate-700 rounded'
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className='flex-1 p-4'>
          <ul className='space-y-2'>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive(item.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span className={`${!sidebarOpen && 'hidden'}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div
          className={`p-4 border-t border-slate-700 ${
            !sidebarOpen && 'text-center'
          }`}
        >
          <p className={`text-xs text-gray-400 ${!sidebarOpen && 'hidden'}`}>
            © 2026 GadgetIMS
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <header className='bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between'>
          <h2 className='text-2xl font-semibold text-gray-800'>
            Inventory Management System
          </h2>
          <div className='flex items-center gap-4'>
            {user && (
              <div className='text-sm text-gray-600'>
                Signed in as
                <div className='font-semibold text-gray-900'>
                  {user.username}
                </div>
              </div>
            )}
            <button
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              className='bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900'
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className='flex-1 overflow-auto p-8'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
