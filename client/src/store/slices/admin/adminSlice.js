import { createSlice } from "@reduxjs/toolkit";
import { deleteCategory, getCategories } from "./adminThunks";
import toast from "react-hot-toast";

const initialState = {
  categories: {
    status: "idle",
    data: [],
    error: null,
  },
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.categories.status = "loading";
        state.categories.error = null;
      })

      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories.status = "succeeded";
        state.categories.data = action.payload;
      })

      .addCase(getCategories.rejected, (state, action) => {
        state.categories.status = "failed";
        state.categories.error = action.payload;
      })

      // ================= DELETE CATEGORY =================
      .addCase(deleteCategory.pending, (state) => {
        state.categories.status = "loading";
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories.status = "succeeded";

        // ✅ Remove deleted category from tree (recursive-safe)
        const removeCategory = (categories, id) => {
          return categories
            .filter((cat) => cat.id !== id)
            .map((cat) => ({
              ...cat,
              children: cat.children ? removeCategory(cat.children, id) : [],
            }));
        };
        toast.success("Category deleted successfully");
        state.categories.data = removeCategory(
          state.categories.data,
          action.payload
        );
      })

      .addCase(deleteCategory.rejected, (state, action) => {
        state.categories.status = "idle";
        state.categories.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
