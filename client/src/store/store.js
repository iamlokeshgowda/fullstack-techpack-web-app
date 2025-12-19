import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/admin/adminSlice";
import confirmDialogReducer from "./slices/ui/confirmDialogSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    confirmDialog: confirmDialogReducer,
  },
});
