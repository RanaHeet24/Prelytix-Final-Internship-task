import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shippingInfo: {
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  },
  paymentInfo: {
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  },
  isSubmitting: false,
  error: null,
  orderSuccess: false,
  lastOrder: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    updateShippingInfo: (state, action) => {
      state.shippingInfo = { ...state.shippingInfo, ...action.payload };
    },
    updatePaymentInfo: (state, action) => {
      state.paymentInfo = { ...state.paymentInfo, ...action.payload };
    },
    submitOrderStart: (state) => {
      state.isSubmitting = true;
      state.error = null;
    },
    submitOrderSuccess: (state, action) => {
      state.isSubmitting = false;
      state.orderSuccess = true;
      state.lastOrder = action.payload;
      // Reset details
      state.shippingInfo = initialState.shippingInfo;
      state.paymentInfo = initialState.paymentInfo;
    },
    submitOrderFailure: (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    resetCheckoutStatus: (state) => {
      state.orderSuccess = false;
      state.error = null;
      state.lastOrder = null;
    }
  }
});

export const {
  updateShippingInfo,
  updatePaymentInfo,
  submitOrderStart,
  submitOrderSuccess,
  submitOrderFailure,
  resetCheckoutStatus
} = checkoutSlice.actions;

// Selectors
export const selectShippingInfo = (state) => state.checkout.shippingInfo;
export const selectPaymentInfo = (state) => state.checkout.paymentInfo;
export const selectCheckoutStatus = (state) => ({
  isSubmitting: state.checkout.isSubmitting,
  orderSuccess: state.checkout.orderSuccess,
  error: state.checkout.error,
  lastOrder: state.checkout.lastOrder
});

export default checkoutSlice.reducer;
