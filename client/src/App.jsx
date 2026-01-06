import ConfirmDialog from "./components/ConfirmDialog";
import AppLayout from "./layouts/AppLayout";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "./services/axios";
import { SERVER_ROUTES } from "./utils/constants";
import { setCartFromServer } from "./store/slices/cartSlice";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  useEffect(() => {
    const syncCart = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await api.get(SERVER_ROUTES.USER_CART);
        if (res.data?.data) {
          dispatch(setCartFromServer(res.data.data));
        }
      } catch (err) {
        console.error("Failed to sync cart on load", err);
      }
    };
    syncCart();
  }, [isAuthenticated]);

  return (
    <>
      <PayPalScriptProvider
        options={{
          "client-id": paypalClientId,
        }}
      >
        <AppLayout>
          <AppRoutes />
        </AppLayout>
        <ConfirmDialog />
      </PayPalScriptProvider>
    </>
  );
}

export default App;
