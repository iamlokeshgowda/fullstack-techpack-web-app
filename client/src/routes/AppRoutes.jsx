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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      {/* Protected Routes */}
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path='/admin/dashboard'
        element={
          <RequireAuth allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </RequireAuth>
        }
      />

      <Route
        path='/admin/categories'
        element={
          <RequireAuth allowedRoles={["ADMIN"]}>
            <Categories />
          </RequireAuth>
        }
      />
      {/* Fallback */}

      <Route path='/unauthorized' element={<NotFound />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
