import { Navigate } from 'react-router-dom';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ element }) => {
  const authState = useSelector((state: RootState) => {
    console.log('PrivateRoute Redux state:', state); // Debug log
    return state.auth;
  });
  const token = authState?.token ?? null;

  return token ? element : <Navigate to="/adminlogin" replace />;
};

export default PrivateRoute;