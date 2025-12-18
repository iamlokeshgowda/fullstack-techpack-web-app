import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

import { store } from "./store/store";
import App from "./App";
import "./index.css";

// console.log("Google Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={`142669272142-pbat5d7mll570iha9oevl159punbtbg9.apps.googleusercontent.com`}
    >
      <Provider store={store}>
        <BrowserRouter>
          <App />
          {/* Global Toasts */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { fontSize: "14px" },
            }}
          />
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
