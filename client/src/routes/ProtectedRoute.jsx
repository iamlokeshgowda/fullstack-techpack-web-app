import RequireAuth from "./RequireAuth";

const ProtectedRoute = ({ allowedRoles, children }) => {
  return <RequireAuth allowedRoles={allowedRoles}>{children}</RequireAuth>;
};

export default ProtectedRoute;
