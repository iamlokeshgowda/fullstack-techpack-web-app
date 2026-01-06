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
  CATEGROY_PRODUCTS: "/category/:slug",
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
  PUBLIC_PRODUCT_BY_SLUG: "/public/product",
  USER_CART: "/user/cart",

  //=============Paypal ==========
  CREATE_ORDER: "/paypal/create-order",
  CAPTURE_ORDER: "/paypal/capture-order",
  CANCEL_ORDER: "/paypal/cancel",
  CANCEL_ORDER: "/paypal/fail",
  UPDATE_STATUS: "/paypal/update-status",
};
