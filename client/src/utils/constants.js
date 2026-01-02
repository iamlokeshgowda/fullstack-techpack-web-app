export const ROUTES = {
  // ===== PUBLIC =====
  LOGIN: "/login",
  REGISTER: "/register",
  UNAUTHORIZED: "/unauthorized",

  // ===== USER =====
  HOME: "/",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  PRODUCT_DETAIL: "/product/:slug",
  CART: "/cart",
  CHECKOUT: "/checkout",
  MY_ORDERS: "/my-orders",

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
  AUTH_PROFILE: "/auth/profile",

  // ===== CATEGORIES =====
  CATEGORIES: "/admin/categories",
  PRODUCTS: "/admin/products",

  // ===== PUBLIC =====
  PUBLIC_CATEGORIES: "/public/categories",
  PUBLIC_PRODUCTS: "/public/products",
  USER_CART: "/user/cart",
};
