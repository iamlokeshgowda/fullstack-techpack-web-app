// components/AppHeader.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ROUTES } from "../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

export default function AppHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // clear state
    navigate(ROUTES.LOGIN); // move user to login
  };

  // Default avatar if no profileUrl available
  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/9187/9187604.png";

  /** NAVIGATION VISIBLE BASED ON ROLE */
  const commonLinks = [{ name: "Home", path: ROUTES.HOME }];

  const userLinks = [
    { name: "Dashboard", path: ROUTES.DASHBOARD },
    { name: "Profile", path: ROUTES.PROFILE },
  ];

  const adminLinks = [
    { name: "Dashboard", path: ROUTES.ADMIN_DASHBOARD },
    { name: "Products", path: ROUTES.ADMIN_PRODUCTS },
    { name: "Categories", path: ROUTES.ADMIN_CATEGORIES },
  ];

  const navLinks = [
    ...commonLinks,
    ...(user?.role === "ADMIN"
      ? adminLinks
      : user?.role === "USER"
      ? userLinks
      : []),
  ];

  return (
    <header className='sticky top-0 z-50 bg-white shadow'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link to='/' className='text-xl font-bold text-blue-600'>
            AppName
          </Link>

          {/* Desktop Nav */}
          <nav className='hidden md:flex items-center space-x-6'>
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-gray-600 hover:text-blue-600 transition font-medium ${
                    isActive ? "text-blue-600" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Avatar + Logout */}
            {user ? (
              <div className='flex items-center gap-3'>
                <img
                  src={user.profileUrl || defaultAvatar}
                  alt='avatar'
                  className='h-8 w-8 rounded-full object-cover border'
                />

                <button
                  onClick={handleLogout}
                  className='text-sm text-red-500 hover:text-red-600 font-medium'
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink to={ROUTES.LOGIN} className='text-blue-600 font-medium'>
                Login
              </NavLink>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden text-gray-600 text-2xl'
            onClick={() => setOpen(!open)}
          >
            {open ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {open && (
        <nav className='md:hidden bg-gray-50 px-4 py-3 shadow space-y-3'>
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className='block text-gray-700 hover:text-blue-600 font-medium'
            >
              {item.name}
            </NavLink>
          ))}

          {/* Avatar + Logout in mobile */}
          {user ? (
            <>
              <div className='flex items-center gap-3 mt-2'>
                <img
                  src={user.profileUrl || defaultAvatar}
                  alt='avatar'
                  className='h-8 w-8 rounded-full object-cover border'
                />
                <span className='text-gray-700 font-medium'>
                  {user.name || "User"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className='w-full text-left text-red-500 hover:text-red-600 font-medium'
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to={ROUTES.LOGIN}
              className='block text-blue-600 font-medium'
            >
              Login
            </NavLink>
          )}
        </nav>
      )}
    </header>
  );
}
