import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Categories", path: "/admin/categories" },
  { name: "Products", path: "/admin/products" },
  { name: "Users", path: "/admin/users" },
];

const Sidebar = () => {
  return (
    <aside className='w-64 bg-gray-900 text-white'>
      <div className='h-16 flex items-center justify-center font-bold text-xl border-b border-gray-700'>
        Admin Panel
      </div>

      <nav className='p-4 space-y-2'>
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
