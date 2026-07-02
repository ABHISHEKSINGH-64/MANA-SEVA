import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from './State';

export function ProtectedRoute({ adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Loader label="Checking session" />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
