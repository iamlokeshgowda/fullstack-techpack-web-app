import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import Categories from "../pages/admin/Categories";
import RequireAuth from "./RequireAuth";
import AdminDashboard from "../pages/admin/AdminDashboard";
import { ROUTES } from "../utils/constants";
import Home from "../pages/Home";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.HOME} element={<Home />} />

      {/* Protected Routes */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path={ROUTES.ADMIN_DASHBOARD}
        element={
          <RequireAuth allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </RequireAuth>
        }
      />

      <Route
        path={ROUTES.ADMIN_CATEGORIES}
        element={
          <RequireAuth allowedRoles={["ADMIN"]}>
            <Categories />
          </RequireAuth>
        }
      />

      <Route
        path={ROUTES.ADMIN_PRODUCTS}
        element={
          <RequireAuth allowedRoles={["ADMIN"]}>
            <Categories />
          </RequireAuth>
        }
      />
      {/* Fallback */}

      <Route path={ROUTES.UNAUTHORIZED} element={<NotFound />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
