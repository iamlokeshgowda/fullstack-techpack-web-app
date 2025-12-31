import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import pubicReducer from "./slices/public/publicSlice";
import adminReducer from "./slices/admin/adminSlice";
import confirmDialogReducer from "./slices/ui/confirmDialogSlice";

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  public: pubicReducer,
  confirmDialog: confirmDialogReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // reducers to persist (store only auth if you want)
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
