import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role"); // "ADMIN" or "USER"
  const user = useSelector((state) => state.auth.user);

  // ❌ Not logged in
  if (!token) {
    return <Navigate to='/login' replace />;
  }

  // ❌ Logged in but role not allowed
  // if (allowedRoles && !allowedRoles.includes(role)) {
  //       return <Navigate to='/unauthorized' replace />;
  //   }

  // ✅ Allowed
  return children;
};

export default RequireAuth;
