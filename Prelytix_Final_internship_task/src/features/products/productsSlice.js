import { createSlice } from '@reduxjs/toolkit';
import productsData from '../../data/products.json';

const initialState = {
  items: productsData,
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
  },
});

export const { setCategory } = productsSlice.actions;

export const selectAllProducts = (state) => state.products.items;
export const selectSelectedCategory = (state) => state.products.selectedCategory;
export const selectProductsLoading = (state) => state.products.loading;

export default productsSlice.reducer;
