import { createSlice } from "@reduxjs/toolkit";
import { getPublicCategories } from "./publicThunks";

const initialState = {
  categories: {
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
      // ================= GET =================
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
      });
  },
});

export default pubicSlice.reducer;
