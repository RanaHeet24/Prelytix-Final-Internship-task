import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import RootLayout from '../components/Layout/RootLayout';
import LoadingScreen from '../components/UI/LoadingScreen';

// Direct import for Products Page
import ProductsPage from '../pages/ProductsPage';

// Lazy loaded pages
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* Products page (Direct Load) */}
          <Route index element={<ProductsPage />} />
          
          {/* Cart page (Lazy Load with Suspense fallback) */}
          <Route 
            path={ROUTES.CART} 
            element={
              <Suspense fallback={<LoadingScreen />}>
                <CartPage />
              </Suspense>
            } 
          />
          
          {/* Checkout page (Lazy Load with Suspense fallback) */}
          <Route 
            path={ROUTES.CHECKOUT} 
            element={
              <Suspense fallback={<LoadingScreen />}>
                <CheckoutPage />
              </Suspense>
            } 
          />
          
          {/* Fallback redirect to products list */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
