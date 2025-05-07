import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalAmount: 0,
  restaurantId: null,
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { item, restaurantId } = action.payload;
      
      // If cart is empty or same restaurant, add item
      if (!state.restaurantId || state.restaurantId === restaurantId) {
        const existingItem = state.items.find(i => i.id === item.id);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({ ...item, quantity: 1 });
        }
        
        state.restaurantId = restaurantId;
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      } else {
        // If different restaurant, clear cart and add new item
        state.items = [{ ...item, quantity: 1 }];
        state.restaurantId = restaurantId;
        state.totalAmount = item.price;
      }
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.items.find(item => item.id === itemId);
      
      if (existingItem.quantity === 1) {
        state.items = state.items.filter(item => item.id !== itemId);
      } else {
        existingItem.quantity -= 1;
      }
      
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      
      if (state.items.length === 0) {
        state.restaurantId = null;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.restaurantId = null;
    },
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item) {
        item.quantity = quantity;
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  setLoading,
  setError,
  clearError
} = cartSlice.actions;

export default cartSlice.reducer; 