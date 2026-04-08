import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userData, loading, isEmailVerified } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to /auth but save the current location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isEmailVerified) {
    // Redirect to /auth with a special state to show verification message
    return <Navigate to="/auth" state={{ from: location, needsVerification: true }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
