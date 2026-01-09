import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface ProtectedRouteProps {
  allowedRoles?: Array<'admin' | 'installer'>;
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isInstaller } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles) {
    const hasAccess =
      (allowedRoles.includes('admin') && isAdmin) ||
      (allowedRoles.includes('installer') && isInstaller);

    if (!hasAccess) {
      return <Navigate to="/orders" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
