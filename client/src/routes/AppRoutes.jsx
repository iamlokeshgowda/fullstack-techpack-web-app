import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
