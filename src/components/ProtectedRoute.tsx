import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userData, loading, isEmailVerified } = useAuth();
  const location = useLocation();

  if (loading) {
    console.log("[ProtectedRoute] Auth is loading, showing spinner...");
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    console.log("[ProtectedRoute] No user authenticated, redirecting to /auth");
    // Redirect to /auth but save the current location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const ADMIN_EMAIL = "info.realcipher@gmail.com";
  const isAdmin = currentUser?.email === ADMIN_EMAIL;

  if (!isEmailVerified && !isAdmin) {
    console.log("[ProtectedRoute] Email not verified and not admin, redirecting to /auth with needsVerification");
    // Redirect to /auth with a special state to show verification message
    return <Navigate to="/auth" state={{ from: location, needsVerification: true }} replace />;
  }

  console.log("[ProtectedRoute] Access granted to:", location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
