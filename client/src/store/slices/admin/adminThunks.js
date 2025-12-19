import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/axios";
import { SERVER_ROUTES } from "../../../utils/constants";
import toast from "react-hot-toast";

// 🔥 Single action to fetch categories
export const getCategories = createAsyncThunk(
  "admin/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(SERVER_ROUTES.GET_CATEGORIES);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "admin/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${SERVER_ROUTES.DELETE_CATEGORY}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        toast.error(
          error.response?.data?.message || "Failed to delete category"
        )
      );
    }
  }
);
