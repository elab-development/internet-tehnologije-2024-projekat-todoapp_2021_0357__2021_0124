import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute: React.FC = () => {
  const { user, token } = useAuth();

  // proveri da li korisnik postoji tj da ima token
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // ako postoji, renderuj sadržaj
  return <Outlet />;
};

export default ProtectedRoute;
