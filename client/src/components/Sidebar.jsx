import { NavLink } from "react-router-dom";
import { ROUTES } from "../utils/constants";

const menu = [
  { label: "Dashboard", path: ROUTES.ADMIN_DASHBOARD },
  { label: "Orders", path: ROUTES.ADMIN_ORDER_DASHBOARD },
  { label: "Categories", path: ROUTES.ADMIN_CATEGORIES },
  { label: "Products", path: ROUTES.ADMIN_PRODUCTS },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="h-16 flex items-center justify-center font-bold text-xl border-b border-gray-700">
        Admin Panel
      </div>

      <nav className="p-4 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
