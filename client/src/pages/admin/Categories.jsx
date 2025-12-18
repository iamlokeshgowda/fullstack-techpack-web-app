import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PlusIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

import CategoryTree from "./components/CategoryTree";
import { getCategories } from "../../store/slices/admin/adminThunks";
import AdminLayout from "../../layouts/AdminLayout";

export default function Categories() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.admin.categories);

  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    if (data.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch, data.length]);

  const handleEdit = (category) => {
    setEditingCategory(category);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this category?")) {
      console.log("Delete:", id);
      // dispatch(deleteCategory(id))
    }
  };

  return (
    <AdminLayout>
      <div className='bg-gray-100 p-6 rounded'>
        {/* Header */}
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold'>Categories</h2>

          <div className='flex gap-3'>
            {/* Add Category */}
            <button
              onClick={() => setEditingCategory({})}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              title='Add Category'
            >
              <PlusIcon className='w-5 h-5' />
              <span className='hidden sm:inline'>Add</span>
            </button>

            {/* Refresh */}
            <button
              onClick={() => dispatch(getCategories())}
              disabled={status === "loading"}
              className='flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50'
              title='Refresh Categories'
            >
              <ArrowPathIcon
                className={`w-5 h-5 ${
                  status === "loading" ? "animate-spin" : ""
                }`}
              />
              <span className='hidden sm:inline'>Refresh</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {status === "loading" ? (
          <p className='text-gray-500'>Loading categories...</p>
        ) : (
          <CategoryTree
            categories={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Edit / Add Form (future) */}
        {/* {editingCategory && (
          <CategoryForm
            category={editingCategory}
            onClose={() => setEditingCategory(null)}
          />
        )} */}
      </div>
    </AdminLayout>
  );
}
