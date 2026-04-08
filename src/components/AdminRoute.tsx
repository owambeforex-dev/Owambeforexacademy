import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'finance_admin' | 'support_admin' | 'admin';
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, requiredRole }) => {
  const { currentUser, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const userRole = userData?.role;
  const isSuperAdmin = userRole === 'super_admin';

  if (!currentUser || !isSuperAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AccessDenied = () => (
  <div className="pt-32 pb-12 min-h-screen bg-bg-primary flex items-center justify-center">
    <div className="text-center max-w-md px-4">
      <AlertTriangle size={64} className="text-error mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-text-primary mb-4">Access Denied</h2>
      <p className="text-text-secondary mb-8">
        You do not have the required permissions to view this page. This action has been logged.
      </p>
      <button 
        onClick={() => window.location.href = '/'} 
        className="w-full py-4 bg-brand-primary text-bg-primary font-bold rounded-xl shadow-lg shadow-brand-primary/20"
      >
        Return to Safety
      </button>
    </div>
  </div>
);

export default AdminRoute;
