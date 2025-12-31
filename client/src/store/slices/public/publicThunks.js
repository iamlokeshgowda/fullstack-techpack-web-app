import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/axios";
import { SERVER_ROUTES } from "../../../utils/constants";

// 🔥 Single action to fetch categories
export const getPublicCategories = createAsyncThunk(
  "public/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(SERVER_ROUTES.PUBLIC_CATEGORIES);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);
