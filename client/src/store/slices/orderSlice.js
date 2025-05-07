import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    createOrderStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createOrderSuccess: (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload;
      state.orders.unshift(action.payload);
    },
    createOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
      }
      if (state.currentOrder?.id === orderId) {
        state.currentOrder.status = status;
      }
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  updateOrderStatus,
  setCurrentOrder,
  clearCurrentOrder,
  clearError
} = orderSlice.actions;

export default orderSlice.reducer; 