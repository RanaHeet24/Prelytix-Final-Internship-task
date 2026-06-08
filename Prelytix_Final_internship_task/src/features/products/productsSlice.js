import { createSlice } from '@reduxjs/toolkit';
import { MOCK_PRODUCTS } from '../../data/products';

const initialState = {
  items: MOCK_PRODUCTS,
  loading: false,
  error: null,
  selectedCategory: 'All',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    // Skeleton placeholder for fetching products
    fetchProductsStart: (state) => {
      state.loading = true;
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  },
});

export const { 
  setCategory, 
  fetchProductsStart, 
  fetchProductsSuccess, 
  fetchProductsFailure 
} = productsSlice.actions;

export const selectAllProducts = (state) => state.products.items;
export const selectSelectedCategory = (state) => state.products.selectedCategory;
export const selectProductsLoading = (state) => state.products.loading;

export default productsSlice.reducer;
