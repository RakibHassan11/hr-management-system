// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { FC } from "react";

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ element }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default PrivateRoute;
