import { createSlice, createSelector } from '@reduxjs/toolkit';
import { loadCartState } from '../../services/localStorage';

const persistedState = loadCartState();

const initialState = {
  items: persistedState.items, // Structure: { id, name, price, quantity, stock, category, image }
  promoCode: persistedState.promoCode,
  discount: persistedState.promoCode === 'SMARTCART20' ? 0.20 : 0,
  shippingCost: 15.00,
  taxRate: 0.08, // 8%
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      // Stock protection validation
      if (product.stock <= 0) return;

      if (existingItem) {
        // Enforce max quantity limit of 10
        if (existingItem.quantity >= 10) return;
        
        // Enforce stock capacity check
        if (existingItem.quantity >= product.stock) return;

        existingItem.quantity += 1;
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          category: product.category,
          quantity: 1
        });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    incrementQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        if (item.quantity < 10 && item.quantity < item.stock) {
          item.quantity += 1;
        }
      }
    },
    decrementQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        }
      }
    },
    applyPromoCode: (state, action) => {
      const code = action.payload;
      state.promoCode = code;
      if (code?.toUpperCase() === 'SMARTCART20') {
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
  incrementQuantity, 
  decrementQuantity, 
  applyPromoCode, 
  clearCart 
} = cartSlice.actions;

// Reusable Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartPromo = (state) => state.cart.promoCode;
export const selectCartDiscount = (state) => state.cart.discount;

export const selectCartSubtotal = (state) => 
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

export const selectCartTotalQuantity = (state) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartCalculations = createSelector(
  [
    selectCartItems, 
    selectCartDiscount, 
    (state) => state.cart.shippingCost, 
    (state) => state.cart.taxRate
  ],
  (items, discountRate, shippingCost, taxRate) => {
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discountAmount = subtotal * discountRate;
    const taxableAmount = subtotal - discountAmount;
    const tax = taxableAmount * taxRate;
    const shipping = subtotal > 0 && taxableAmount > 150 ? 0 : (subtotal > 0 ? shippingCost : 0);
    const total = taxableAmount + tax + shipping;

    return {
      subtotal,
      discountAmount,
      tax,
      shipping,
      total
    };
  }
);

export default cartSlice.reducer;
