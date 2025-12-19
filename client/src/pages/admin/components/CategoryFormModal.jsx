import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useMemo, useEffect } from "react";

/* =======================
   HELPERS (SAME FILE)
======================= */
// Convert text to URL-safe slug
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

// Find category by id in tree
const findCategoryById = (categories, id) => {
  for (const cat of categories) {
    if (cat.id === id) return cat;
    if (cat.children?.length) {
      const found = findCategoryById(cat.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Build full parent slug path (N-level)
const buildParentSlugPath = (categories, parentId) => {
  if (!parentId) return "";

  const parent = findCategoryById(categories, parentId);
  if (!parent) return "";

  return parent.catSlug;
};
// Flatten category tree (N-level) for dropdown
const flattenCategories = (categories, level = 0, result = []) => {
  categories.forEach((cat) => {
    result.push({
      id: cat.id,
      label: `${"— ".repeat(level)}${cat.catName}`,
    });

    if (cat.children?.length) {
      flattenCategories(cat.children, level + 1, result);
    }
  });

  return result;
};

// Collect all child IDs of a category (to prevent circular parenting)
const collectChildIds = (category) => {
  let ids = [];
  if (category?.children?.length) {
    category.children.forEach((child) => {
      ids.push(child.id, ...collectChildIds(child));
    });
  }
  return ids;
};

/* =======================
   COMPONENT
======================= */

const CategoryFormModal = ({
  category,
  onClose,
  onSubmit,
  isSubmitting = false,
  categories = [],
}) => {
  const [form, setForm] = useState({
    catName: category?.catName || "",
    catSlug: category?.catSlug || "",
    catMetaDesc: category?.catMetaDesc || "",
    catMetaKeyword: category?.catMetaKeyword || "",
    parentId: category?.parentId || "",
    isActive: category?.isActive ?? true,
  });

  // Flatten categories only once
  const flatCategories = useMemo(
    () => flattenCategories(categories),
    [categories]
  );

  // Get all child ids of current category (edit mode)
  const childIds = useMemo(
    () => (category ? collectChildIds(category) : []),
    [category]
  );

  /* =======================
     HANDLERS
  ======================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Normalize parentId
    const payload = {
      ...form,
      parentId:
        form.parentId === "" || form.parentId === undefined
          ? null
          : form.parentId,
    };

    onSubmit(payload);
  };

  useEffect(() => {
    const catSlug = slugify(form.catName);

    setForm((prev) => ({
      ...prev,
      catSlug,
    }));
  }, [form.catName, form.parentId, categories]);

  /* =======================
     UI
  ======================= */

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-white rounded-lg w-full max-w-md shadow-lg'>
        {/* Header */}
        <div className='flex justify-between items-center px-6 py-4 border-b'>
          <h3 className='text-lg font-semibold'>
            {category?.id ? "Edit Category" : "Add Category"}
          </h3>
          <button onClick={onClose}>
            <XMarkIcon className='w-5 h-5 text-gray-500 hover:text-gray-700' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {/* Name */}
          <div>
            <label className='block text-sm font-medium mb-1'>
              Category Name
            </label>
            <input
              name='catName'
              value={form.catName}
              onChange={handleChange}
              required
              className='w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Slug (Auto-generated) */}
          <div>
            <label className='block text-sm font-medium mb-1'>
              Category Slug
            </label>
            <input
              name='catSlug'
              value={form.catSlug}
              readOnly
              className='w-full border rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed'
            />
            <p className='text-xs text-gray-500 mt-1'>
              Slug is auto-generated and cannot be edited
            </p>
          </div>

          {/* Meta Description */}
          <div>
            <label className='block text-sm font-medium mb-1'>
              Meta Description
            </label>
            <textarea
              name='catMetaDesc'
              value={form.catMetaDesc}
              onChange={handleChange}
              rows={3}
              className='w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500'
              placeholder='SEO description (optional)'
            />
          </div>

          {/* Meta Keywords */}
          <div>
            <label className='block text-sm font-medium mb-1'>
              Meta Keywords
            </label>
            <input
              name='catMetaKeyword'
              value={form.catMetaKeyword}
              onChange={handleChange}
              className='w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500'
              placeholder='comma,separated,keywords'
            />
          </div>

          {/* Parent Category (N-level) */}
          <div>
            <label className='block text-sm font-medium mb-1'>
              Parent Category
            </label>

            <select
              name='parentId'
              value={form.parentId ?? ""}
              onChange={handleChange}
              className='w-full border rounded px-3 py-2'
            >
              <option value=''>None</option>

              {flatCategories.map((c) => {
                const isSelf = category?.id === c.id;
                const isChild = childIds.includes(c.id);

                return (
                  <option key={c.id} value={c.id} disabled={isSelf || isChild}>
                    {c.label}
                    {isSelf ? " (Current)" : isChild ? " (Child)" : ""}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Active */}
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              name='isActive'
              checked={form.isActive}
              onChange={handleChange}
            />
            <span className='text-sm'>Active</span>
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 border rounded'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
