import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("cart")) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += product.quantity || 1;
      } else {
        state.items.push({
          id: product.id,
          quantity: product.quantity || 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    // Merge server cart with local cart (server items take precedence)
    mergeServerCart: (state, action) => {
      const serverItems = action.payload || [];
      const serverMap = new Map(
        serverItems.map((item) => [item.productId, item])
      );

      const merged = [];
      serverItems.forEach((item) => {
        merged.push({
          id: item.productId,
          quantity: item.quantity,
        });
      });

      state.items.forEach((localItem) => {
        if (!serverMap.has(localItem.id)) {
          merged.push(localItem);
        }
      });

      state.items = merged;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    // Replace cart with server cart
    setCartFromServer: (state, action) => {
      const serverItems = action.payload || [];
      state.items = serverItems.map((item) => ({
        id: item.productId,
        quantity: item.quantity,
      }));
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  mergeServerCart,
  setCartFromServer,
} = cartSlice.actions;
export default cartSlice.reducer;
