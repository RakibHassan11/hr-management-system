import { Navigate, useLocation } from 'react-router-dom';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ element }) => {
  const location = useLocation(); 
  const authState = useSelector((state: RootState) => {
    return state.auth;
  });

  const isAuthenticatedUser = authState?.isAuthenticatedUser ?? false;
  const isAuthenticatedAdmin = authState?.isAuthenticatedAdmin ?? false;

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isUserRoute = location.pathname.startsWith('/user');
  const isLoginRoute = location.pathname === '/login';
  const isAdminLoginRoute = location.pathname === '/adminlogin';

  if (isLoginRoute && isAuthenticatedUser) {
    return <Navigate to="/user/home" replace />;
  }

  if (isAdminLoginRoute && isAuthenticatedAdmin) {
    return <Navigate to="/admin/AdminHome" replace />;
  }

  if (isAdminRoute) {
    return isAuthenticatedAdmin ? element : <Navigate to="/adminlogin" state={{ from: location }} replace />;
  }

  if (isUserRoute) {
    return isAuthenticatedUser ? element : <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export default PrivateRoute;