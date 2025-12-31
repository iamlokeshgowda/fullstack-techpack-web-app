export const ROUTES = {
  // ===== PUBLIC =====
  LOGIN: "/login",
  REGISTER: "/register",
  UNAUTHORIZED: "/unauthorized",

  // ===== USER =====
  HOME: "/",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",

  // ===== ADMIN =====
  ADMIN_ROOT: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_PRODUCTS: "/admin/products",
};

export const SERVER_ROUTES = {
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_GOOGLE: "/auth/google",

  // ===== CATEGORIES =====
  CATEGORIES: "/admin/categories",
  PRODUCTS: "/admin/products",

  // ===== PUBLIC =====
  PUBLIC_CATEGORIES: "/public/categories",
};
