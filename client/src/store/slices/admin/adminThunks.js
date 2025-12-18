import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/axios";

// 🔥 Single action to fetch categories
export const getCategories = createAsyncThunk(
  "admin/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/categories");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);
