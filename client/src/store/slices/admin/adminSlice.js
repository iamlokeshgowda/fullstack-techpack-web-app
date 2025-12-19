import { createSlice } from "@reduxjs/toolkit";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./adminThunks";

const initialState = {
  categories: {
    status: "idle",
    data: [],
    error: null,
  },
};

// 🔁 Insert category into tree
const insertCategoryRecursive = (categories, newCategory) => {
  // Root category
  if (!newCategory.parentId) {
    return [...categories, { ...newCategory, children: [] }];
  }

  return categories.map((cat) => {
    if (cat.id === newCategory.parentId) {
      return {
        ...cat,
        children: [...(cat.children || []), { ...newCategory, children: [] }],
      };
    }

    if (cat.children?.length) {
      return {
        ...cat,
        children: insertCategoryRecursive(cat.children, newCategory),
      };
    }

    return cat;
  });
};

// 🔁 Update category in tree
const updateCategoryRecursive = (categories, updated) => {
  return categories.map((cat) => {
    if (cat.id === updated.id) {
      return {
        ...cat,
        ...updated,
        children: cat.children || [],
      };
    }

    if (cat.children?.length) {
      return {
        ...cat,
        children: updateCategoryRecursive(cat.children, updated),
      };
    }

    return cat;
  });
};

// 🔁 Remove category from tree
const removeCategoryRecursive = (categories, id) => {
  return categories
    .filter((cat) => cat.id !== id)
    .map((cat) => ({
      ...cat,
      children: cat.children ? removeCategoryRecursive(cat.children, id) : [],
    }));
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ================= GET =================
      .addCase(getCategories.pending, (state) => {
        state.categories.status = "loading";
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories.status = "succeeded";
        state.categories.data = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.categories.status = "failed";
        state.categories.error = action.payload;
      })

      // ================= CREATE =================
      .addCase(createCategory.pending, (state) => {
        state.categories.status = "loading";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.status = "succeeded";

        state.categories.data = insertCategoryRecursive(
          state.categories.data,
          action.payload
        );
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.categories.status = "failed";
        state.categories.error = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories.status = "succeeded";

        state.categories.data = updateCategoryRecursive(
          state.categories.data,
          action.payload
        );
      })

      // ================= DELETE =================
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories.data = removeCategoryRecursive(
          state.categories.data,
          action.payload
        );
      });
  },
});

export default adminSlice.reducer;
