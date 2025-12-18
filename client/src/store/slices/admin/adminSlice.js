import { createSlice } from "@reduxjs/toolkit";
import { getCategories } from "./adminThunks";

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
      });
  },
});

export default adminSlice.reducer;
