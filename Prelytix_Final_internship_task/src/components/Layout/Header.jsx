import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartTotalQuantity } from '../../features/cart/cartSlice';
import { ROUTES } from '../../constants/routes';
import { ShoppingBag, CreditCard, LayoutGrid } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const totalQuantity = useSelector(selectCartTotalQuantity);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-effect border-b border-white/5 shadow-lg shadow-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to={ROUTES.PRODUCTS} className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center text-white shadow-md shadow-indigo-500/10">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              AetherCart
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-4">
            <Link
              to={ROUTES.PRODUCTS}
              className={`flex items-center space-x-1 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive(ROUTES.PRODUCTS)
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Products</span>
            </Link>

            <Link
              to={ROUTES.CART}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all relative ${
                isActive(ROUTES.CART)
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white ring-2 ring-[#090d16] animate-pulse">
                  {totalQuantity}
                </span>
              )}
            </Link>

            <Link
              to={ROUTES.CHECKOUT}
              className={`flex items-center space-x-1 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive(ROUTES.CHECKOUT)
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Checkout</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
