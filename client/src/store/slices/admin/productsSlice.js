import { createSlice } from "@reduxjs/toolkit";
import { deleteProduct } from "./adminThunks";

const initialState = {
  status: "idle",
  data: [],
  error: null,
};

const productsSlice = createSlice({
  name: "admin/products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.data = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    addProduct: (state, action) => {
      state.data.push(action.payload);
    },
    updateProduct: (state, action) => {
      const idx = state.data.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.data[idx] = action.payload;
    },
    removeProduct: (state, action) => {
      state.data = state.data.filter((p) => p.id !== action.payload);
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    },
    clearProducts: (state) => {
      state.data = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
  setStatus,
  setError,
  clearProducts,
} = productsSlice.actions;

export default productsSlice.reducer;
