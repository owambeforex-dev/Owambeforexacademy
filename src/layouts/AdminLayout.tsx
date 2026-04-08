import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Shield, 
  LogOut, 
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const { logout, userData } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin-dashboard' },
    { icon: <Users size={20} />, label: 'Users', path: '/admin-dashboard?tab=users' },
    { icon: <Wallet size={20} />, label: 'Finances', path: '/admin-dashboard?tab=finances' },
    { icon: <Shield size={20} />, label: 'Security', path: '/admin-dashboard?tab=security' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-surface border-r border-border-base sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <Shield className="text-bg-primary" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-text-primary tracking-tight">ADMIN</h1>
              <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Owambe Forex</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-text-secondary hover:text-brand-primary hover:bg-brand-primary/5 transition-all font-bold group"
              >
                <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-border-base">
          <div className="flex items-center gap-4 mb-8 p-4 bg-bg-secondary rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black">
              {userData?.name?.[0] || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-text-primary truncate">{userData?.name || 'Admin'}</p>
              <p className="text-[10px] text-text-muted truncate">Super Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-error hover:bg-error/5 transition-all font-bold"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-surface z-50 transition-transform duration-300 lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                <Shield className="text-bg-primary" size={24} />
              </div>
              <h1 className="text-xl font-black text-text-primary">ADMIN</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-text-primary">
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-text-secondary font-bold"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl text-error font-bold"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-surface border-b border-border-base flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-text-primary"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-3 bg-bg-secondary px-4 py-2 rounded-xl border border-border-base w-64 lg:w-96">
              <Search size={18} className="text-text-muted" />
              <input 
                type="text" 
                placeholder="Search users, transactions..."
                className="bg-transparent border-none outline-none text-sm text-text-primary w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center text-text-primary hover:bg-border-base transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border-2 border-surface"></span>
            </button>
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-bg-primary font-black shadow-lg shadow-brand-primary/20">
              {userData?.name?.[0] || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
