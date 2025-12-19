import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/axios";
import { SERVER_ROUTES } from "../../../utils/constants";
import toast from "react-hot-toast";

// 🔥 Single action to fetch categories
export const getCategories = createAsyncThunk(
  "admin/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(SERVER_ROUTES.CATEGORIES);
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
      await api.delete(`${SERVER_ROUTES.CATEGORIES}/${id}`);
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

export const updateCategory = createAsyncThunk(
  "admin/updateCategory",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${SERVER_ROUTES.CATEGORIES}/${id}`,
        payload
      );

      toast.success("Category updated successfully");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update category";

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "admin/createCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post(SERVER_ROUTES.CATEGORIES, payload);

      toast.success("Category created successfully");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create category";

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
