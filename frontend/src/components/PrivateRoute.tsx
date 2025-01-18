import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/Auth.context';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthed, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (!isAuthed) {
    return (
      <Navigate to="/login" state={{ from: location.pathname }} replace />
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
