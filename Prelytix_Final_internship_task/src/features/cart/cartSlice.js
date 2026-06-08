import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Structure: { id, name, price, quantity, gradient, category }
  promoCode: null,
  discount: 0,
  shippingCost: 15.00,
  taxRate: 0.08, // 8%
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },
    applyPromoCode: (state, action) => {
      state.promoCode = action.payload;
      // Foundation state placeholder (actual validation could be added in business logic)
      if (action.payload?.toUpperCase() === 'SMARTCART20') {
        state.discount = 0.20; // 20% discount
      } else {
        state.discount = 0;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.promoCode = null;
      state.discount = 0;
    }
  }
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  applyPromoCode, 
  clearCart 
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartPromo = (state) => state.cart.promoCode;
export const selectCartDiscount = (state) => state.cart.discount;

export const selectCartSubtotal = (state) => 
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

export const selectCartTotalQuantity = (state) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartCalculations = (state) => {
  const subtotal = state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountAmount = subtotal * state.cart.discount;
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * state.cart.taxRate;
  const shipping = subtotal > 0 && taxableAmount > 150 ? 0 : (subtotal > 0 ? state.cart.shippingCost : 0);
  const total = taxableAmount + tax + shipping;

  return {
    subtotal,
    discountAmount,
    tax,
    shipping,
    total
  };
};

export default cartSlice.reducer;
