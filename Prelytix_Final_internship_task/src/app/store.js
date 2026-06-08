import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import checkoutReducer from '../features/checkout/checkoutSlice';
import { saveCartState } from '../services/localStorage';

// Middleware to sync cart changes to local storage automatically
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Sync state if the action modifies the cart slice
  if (action.type.startsWith('cart/')) {
    const { items, promoCode } = store.getState().cart;
    saveCartState(items, promoCode);
  }
  
  return result;
};

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});
