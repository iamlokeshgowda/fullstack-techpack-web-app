// components/MobileCategoryDrawer.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { ROUTES } from "../utils/constants";
import sideLogo from "../assets/sidelogo.avif";

export default function MobileCategoryDrawer({
  open,
  onClose,
  categories,
  user,
  onLogout,
}) {
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => setExpandedId(expandedId === id ? null : id);

  /** Recursive mobile renderer with depth-based styling */
  const renderMobileTree = (items, depth = 0) => {
    return (
      <ul className='space-y-1'>
        {items.map((cat) => {
          const isGroup = depth === 1;
          const isRootItem = depth === 0;
          const isLeaf = depth >= 2;

          return (
            <li key={cat.id}>
              <Link
                to={`/category/${cat.catSlug}`}
                onClick={() => onClose()}
                className={
                  isRootItem
                    ? "text-lg font-bold text-gray-900 uppercase mb-2"
                    : isGroup
                    ? "text-green-700 font-semibold text-md mt-2"
                    : "text-gray-700 hover:text-blue-600 text-[15px]"
                }
              >
                {cat.catName}
              </Link>

              {/* render children */}
              {cat.children && cat.children.length > 0 && (
                <div className={`${isRootItem ? "mt-1" : "mt-1"} ml-3`}>
                  {renderMobileTree(cat.children, depth + 1)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}
      `}
      ></div>

      {/* DRAWER PANEL */}
      <aside
        className={`fixed top-0 left-0 h-screen w-80 bg-white shadow-xl z-50
        transform transition-transform duration-300 flex flex-col
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* HEADER */}
        <div className='flex items-center justify-between px-4 py-4 border-b'>
          <Link to='/' onClick={onClose}>
            <img alt='logo' src={sideLogo} className='h-14 w-14 mx-auto' />
          </Link>

          <button
            onClick={onClose}
            className='absolute right-4 top-5 text-2xl text-gray-700'
          >
            ✕
          </button>
        </div>

        {/* CATEGORY TREE */}
        <div className='flex-1 overflow-y-auto px-4 py-6'>
          {categories.status === "loading" && (
            <p className='text-gray-500'>Loading...</p>
          )}

          {categories.status === "failed" && (
            <p className='text-red-500'>Failed to load categories</p>
          )}

          {categories.status === "succeeded" &&
            renderMobileTree(categories.data)}
        </div>

        {/* FOOTER CTA */}
        <div className='px-4 pb-6'>
          {user ? (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className='w-full bg-red-600 text-white py-3 rounded-md font-semibold'
            >
              Logout
            </button>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              onClick={onClose}
              className='block w-full text-center bg-black text-white py-3 rounded-md font-semibold'
            >
              Login
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
