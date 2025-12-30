// components/RequireAuth.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../utils/constants";

const RequireAuth = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;

  return allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to={ROUTES.UNAUTHORIZED} replace />
  );
};

export default RequireAuth;
