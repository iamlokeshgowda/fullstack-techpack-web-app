import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PlusIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

import CategoryTree from "./components/CategoryTree";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "../../store/slices/admin/adminThunks";
import AdminLayout from "../../layouts/AdminLayout";
import { showConfirmDialog } from "../../store/slices/ui/confirmDialogSlice";
import SpinnerOverlay from "../../components/SpinnerOverlay";
import CategoryFormModal from "./components/CategoryFormModal";

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
    dispatch(
      showConfirmDialog({
        title: "Delete Category",
        message:
          "Are you sure you want to delete this category? This action cannot be undone.",
        confirmText: "Delete",
        actionType: "DELETE_CATEGORY",
        actionPayload: id,
      })
    );
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

        <CategoryTree
          categories={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {status === "loading" ? (
          <SpinnerOverlay
            show={status === "loading"}
            text='Loading categories...'
          />
        ) : null}
        {/* Edit / Add Form (future) */}
        {editingCategory && (
          <CategoryFormModal
            category={editingCategory}
            categories={data}
            onClose={() => setEditingCategory(null)}
            onSubmit={(payload) => {
              if (editingCategory.id) {
                dispatch(updateCategory({ id: editingCategory.id, payload }));
              } else {
                dispatch(createCategory(payload));
              }
              setEditingCategory(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
