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

  if (isAdminRoute) {
    return isAuthenticatedAdmin ? element : <Navigate to="/adminlogin" state={{ from: location }} replace />;
  }

  if (isUserRoute) {
    return isAuthenticatedUser ? element : <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;