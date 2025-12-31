import { useState } from "react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const CategoryTree = ({ categories, onEdit, onDelete }) => {
  return (
    <ul className='ml-4 space-y-2'>
      {categories?.map((cat) => (
        <CategoryNode
          key={cat.id}
          category={cat}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

const CategoryNode = ({ category, onEdit, onDelete }) => {
  const hasChildren = category.children && category.children.length > 0;

  // ✅ Root open by default, children collapsed
  const [open, setOpen] = useState(false);

  return (
    <li>
      <div className='flex items-center justify-between bg-white p-3 rounded border shadow-sm'>
        {/* Left section */}
        <div className='flex items-center gap-2'>
          {/* Accordion toggle */}
          {hasChildren ? (
            <button onClick={() => setOpen(!open)} className='text-gray-500'>
              {open ? (
                <ChevronDownIcon className='w-4 h-4' />
              ) : (
                <ChevronRightIcon className='w-4 h-4' />
              )}
            </button>
          ) : (
            <span className='w-4' />
          )}

          {/* Category Name */}
          <div>
            <p className='font-medium'>{category.catName}</p>
            <p className='text-xs text-gray-500'>{category.catSlug}</p>
          </div>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-3'>
          {/* Edit */}
          <button
            onClick={() => onEdit(category)}
            className='text-blue-600 hover:text-blue-800'
            title='Edit Category'
          >
            <PencilIcon className='w-5 h-5' />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(category.id)}
            disabled={hasChildren}
            className={`${
              hasChildren
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-600 hover:text-red-800"
            }`}
            title={
              hasChildren ? "Delete child categories first" : "Delete Category"
            }
          >
            <TrashIcon className='w-5 h-5' />
          </button>
        </div>
      </div>

      {/* Recursive children */}
      {hasChildren && open && (
        <CategoryTree
          categories={category.children}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </li>
  );
};

export default CategoryTree;
