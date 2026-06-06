import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function MemberRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'member') return <Navigate to="/admin" replace />;

  return <Outlet />;
}
