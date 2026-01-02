// components/AppHeader.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ROUTES } from "../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import {
  getPublicCategories,
  getPublicProducts,
} from "../store/slices/public/publicThunks";
import MobileCategoryDrawer from "./MobileCategoryDrawer";
import logo from "../assets/logo.png";

export default function AppHeader() {
  const [hoveredCatId, setHoveredCatId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart?.items?.length || 0);
  const { categories, products } = useSelector((state) => state.public);
  const dispatch = useDispatch();

  /** Fetch categories once if list is empty */
  useEffect(() => {
    if (!categories.data?.length && categories.status === "idle") {
      dispatch(getPublicCategories());
    }
    if (!products.data?.length && products.status === "idle") {
      dispatch(getPublicProducts());
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow">
        <div className="max-w-12xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* LEFT: LOGO + MOBILE MENU */}
            <div className="flex items-center gap-4">
              <Link to="/" className="text-xl font-bold text-blue-600">
                <img alt="logo" src={logo} className="h-14" />
              </Link>

              {/* CENTER: DESKTOP NAV */}
              <nav className="hidden md:flex gap-8 items-center relative">
                {categories.status === "succeeded" &&
                  categories.data.map((cat) => (
                    <div
                      key={cat.id}
                      className="relative"
                      onMouseEnter={() => setHoveredCatId(cat.id)}
                      onMouseLeave={() => setHoveredCatId(null)}
                    >
                      <button
                        className={`font-semibold uppercase tracking-wide ${
                          hoveredCatId === cat.id
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-800 hover:text-blue-600"
                        }`}
                      >
                        {cat.catName}
                      </button>

                      {hoveredCatId === cat.id && cat.children?.length > 0 && (
                        <div className="absolute left-0 top-full bg-white shadow-lg px-8 py-8 border-t z-50 w-max max-w-max">
                          <div className="grid grid-cols-4 gap-10">
                            {cat.children.map((sub) => (
                              <div key={sub.id}>
                                <Link
                                  to={`/category/${sub.catSlug}`}
                                  className="text-red-600 font-semibold text-lg hover:text-red-700"
                                >
                                  {sub.catName}
                                </Link>

                                {sub.children?.length > 0 && (
                                  <ul className="mt-3 space-y-1">
                                    {sub.children.map((item) => (
                                      <li key={item.id}>
                                        <Link
                                          to={`/category/${item.catSlug}`}
                                          className="text-gray-700 hover:text-blue-600"
                                        >
                                          {item.catName}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </nav>
            </div>

            {/* RIGHT: SEARCH + PROFILE + CART */}
            <div className="flex items-center gap-5">
              <input
                placeholder="Search product..."
                className="hidden md:block border rounded px-3 py-1 w-64 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              {/* PROFILE DROPDOWN */}
              {/* PROFILE DROPDOWN — open on hover */}
              <div
                className="relative group" // 👈 group enables hover control
              >
                {/* Profile Icon */}
                <div className="flex items-center justify-center">
                  <span className="text-2xl cursor-pointer">👤</span>
                </div>

                <div
                  className="absolute right-0 mt-2 w-56 bg-white shadow-lg border rounded-md py-4 z-50
               opacity-0 invisible group-hover:opacity-100 group-hover:visible
               transition-all duration-200"
                >
                  {/* NOT LOGGED IN */}
                  {!user && (
                    <div className="flex flex-col items-center text-center px-4 space-y-3">
                      <p className="font-semibold text-lg">Welcome</p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        To access account <br /> & manage orders
                      </p>

                      <Link
                        to={ROUTES.LOGIN}
                        className="bg-black text-white px-4 py-2 rounded-md font-semibold w-full"
                      >
                        Login / Signup
                      </Link>
                    </div>
                  )}

                  {/* LOGGED IN */}
                  {user && (
                    <div className="flex flex-col items-center text-center px-4 space-y-3">
                      <p className="font-semibold text-lg">
                        Hello, {user.name}
                      </p>

                      <Link
                        to="/profile"
                        className="hover:text-blue-600 w-full"
                      >
                        My Account
                      </Link>

                      <Link to="/orders" className="hover:text-blue-600 w-full">
                        My Orders
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="text-red-600 font-medium w-full"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* CART ICON */}
              <Link to="/cart" className="relative">
                <span className="text-2xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* MOBILE HAMBURGER */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="md:hidden text-2xl text-gray-700"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <MobileCategoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={categories}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
}
