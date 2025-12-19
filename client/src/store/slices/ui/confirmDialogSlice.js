import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  title: "",
  message: "",
  confirmText: "Confirm",
  cancelText: "Cancel",

  // ✅ Serializable action descriptor
  actionType: null,
  actionPayload: null,
};

const confirmDialogSlice = createSlice({
  name: "confirmDialog",
  initialState,
  reducers: {
    showConfirmDialog: (state, action) => {
      return { ...state, ...action.payload, open: true };
    },
    hideConfirmDialog: () => initialState,
  },
});

export const { showConfirmDialog, hideConfirmDialog } =
  confirmDialogSlice.actions;

export default confirmDialogSlice.reducer;
