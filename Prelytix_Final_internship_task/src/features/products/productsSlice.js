import { createSlice, createSelector } from '@reduxjs/toolkit';
import productsData from '../../data/products.json';

const initialState = {
  items: productsData,
  loading: false,
  error: null,
  selectedCategory: 'All',
  searchQuery: '',
  sortBy: 'none',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
});

export const { setCategory, setSearchQuery, setSortBy } = productsSlice.actions;

// Base Selectors
export const selectAllProducts = (state) => state.products.items;
export const selectSelectedCategory = (state) => state.products.selectedCategory;
export const selectSearchQuery = (state) => state.products.searchQuery;
export const selectSortBy = (state) => state.products.sortBy;
export const selectProductsLoading = (state) => state.products.loading;

// Memoized selector for filtering, searching, and sorting
export const selectFilteredAndSortedProducts = createSelector(
  [selectAllProducts, selectSelectedCategory, selectSearchQuery, selectSortBy],
  (products, category, searchQuery, sortBy) => {
    let result = [...products];

    // 1. Category Filter
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    // 2. Debounced Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }

    // 3. Sorting Options
    if (sortBy === 'price-low-to-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-to-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-a-z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }
);

export default productsSlice.reducer;
