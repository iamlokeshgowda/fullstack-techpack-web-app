// routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import Categories from "../pages/admin/Categories";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";

import { ROUTES } from "../utils/constants";
import Unauthorized from "../pages/Unauthorized";
import Products from "../pages/admin/Products";
import CategoryRelatedProducts from "../pages/CategoryRelatedProducts";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetail />} />
      <Route
        path={ROUTES.CATEGROY_PRODUCTS}
        element={<CategoryRelatedProducts />}
      />
      <Route path={ROUTES.CART} element={<Cart />} />

      {/* USER Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]} />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
      </Route>

      {/* ADMIN Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN_CATEGORIES} element={<Categories />} />
        <Route path={ROUTES.ADMIN_PRODUCTS} element={<Products />} />
      </Route>

      {/* Fallback */}
      <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
