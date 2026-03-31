import { Navigate, useLocation } from 'react-router-dom';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ element }) => {
  const location = useLocation(); 
  const authState = useSelector((state: RootState) => state.auth);

  const isAuthenticated = authState?.isAuthenticatedUser ?? false;

  const isUserRoute = location.pathname.startsWith('/user');
  const isLoginRoute = location.pathname === '/login' || location.pathname === '/';

  if (isUserRoute) {
    return isAuthenticated ? element : <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export default PrivateRoute;