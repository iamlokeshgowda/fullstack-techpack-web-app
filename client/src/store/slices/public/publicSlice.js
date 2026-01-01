import { createSlice } from "@reduxjs/toolkit";
import { getPublicCategories, getPublicProducts } from "./publicThunks";

const initialState = {
  categories: {
    status: "idle",
    data: [],
    error: null,
  },
  products: {
    status: "idle",
    data: [],
    error: null,
  },
};

const pubicSlice = createSlice({
  name: "pubic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ================= GET CATEGORIES=================
      .addCase(getPublicCategories.pending, (state) => {
        state.categories.status = "loading";
      })
      .addCase(getPublicCategories.fulfilled, (state, action) => {
        state.categories.status = "succeeded";
        state.categories.data = action.payload;
      })
      .addCase(getPublicCategories.rejected, (state, action) => {
        state.categories.status = "failed";
        state.categories.error = action.payload;
      })
      // ================= GET PRODUCTS=================
      .addCase(getPublicProducts.pending, (state) => {
        state.products.status = "loading";
      })
      .addCase(getPublicProducts.fulfilled, (state, action) => {
        state.products.status = "succeeded";
        state.products.data = action.payload;
      })
      .addCase(getPublicProducts.rejected, (state, action) => {
        state.products.status = "failed";
        state.products.error = action.payload;
      });
  },
});

export default pubicSlice.reducer;
