import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import pubicReducer from "./slices/public/publicSlice";
import adminReducer from "./slices/admin/adminSlice";
import confirmDialogReducer from "./slices/ui/confirmDialogSlice";
import cartReducer from "./slices/cartSlice";

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  public: pubicReducer,
  confirmDialog: confirmDialogReducer,
  cart: cartReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart"], // persist auth and cart
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Export store and persistor
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);
