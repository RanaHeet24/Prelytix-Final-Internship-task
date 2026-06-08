import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { selectAllProducts, selectSelectedCategory, setCategory } from '../features/products/productsSlice';
import { addToCart, selectCartItems } from '../features/cart/cartSlice';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Star, Filter, Heart, AlertCircle } from 'lucide-react';

const CATEGORIES = ['All', 'Audio', 'Accessories', 'Wearables', 'Video'];

export default function ProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const selectedCategory = useSelector(selectSelectedCategory);
  const cartItems = useSelector(selectCartItems);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product) => {
    const cartItem = cartItems.find(item => item.id === product.id);
    const cartQty = cartItem ? cartItem.quantity : 0;

    if (product.stock <= 0) {
      toast.error(`Sorry, ${product.name} is currently out of stock.`, {
        icon: <AlertCircle className="text-rose-500 w-5 h-5" />
      });
      return;
    }

    if (cartQty >= 10) {
      toast.warn(`You cannot purchase more than 10 units of ${product.name}.`, {
        icon: '⚠️'
      });
      return;
    }

    if (cartQty >= product.stock) {
      toast.warn(`Only ${product.stock} units of ${product.name} are available in stock.`, {
        icon: '⚠️'
      });
      return;
    }

    dispatch(addToCart(product));
    toast.success(`${product.name} added to your cart!`, {
      icon: '🛒'
    });
  };

  const getButtonState = (product) => {
    const cartItem = cartItems.find(item => item.id === product.id);
    const cartQty = cartItem ? cartItem.quantity : 0;

    if (product.stock <= 0) {
      return { disabled: true, text: 'Out of Stock' };
    }
    if (cartQty >= 10) {
      return { disabled: true, text: 'Max Limit (10)' };
    }
    if (cartQty >= product.stock) {
      return { disabled: true, text: 'Limit Reached' };
    }
    return { disabled: false, text: 'Add to Cart' };
  };

  return (
    <div className="space-y-10">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-white/5 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-2xl space-y-4">
          <span className="text-xs font-semibold tracking-widest uppercase text-indigo-400">Exclusive Ecosystem</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Elevate Your Setup with <span className="gradient-text font-black">Aether Series</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Discover our curated lineup of ultra-premium workspace peripherals and lifestyle hardware. Designed to deliver flawless ergonomics and state-of-the-art utility.
          </p>
        </div>
      </div>

      {/* Filter and Content Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center space-x-2.5">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold tracking-wide uppercase text-slate-400">Category Filters</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => dispatch(setCategory(category))}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                selectedCategory === category
                  ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                  : 'bg-slate-950/20 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProducts.map(product => {
          const buttonState = getButtonState(product);
          
          return (
            <Card key={product.id} hoverEffect className="flex flex-col h-full group relative">
              {/* Actual Image representation */}
              <div className="w-full aspect-[4/3] rounded-xl bg-slate-950 border border-white/5 relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-[10px] font-bold text-slate-200 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  {product.category}
                </span>
                
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold text-xs tracking-widest uppercase px-3 py-1.5 rounded-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product details */}
              <div className="mt-5 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-300 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-slate-500 text-xs">
                      <span>Stock:</span>
                      <span className={`font-semibold ${product.stock > 0 ? 'text-slate-300' : 'text-rose-400'}`}>
                        {product.stock}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                    {product.name} premium peripherals custom built for professional workstations. Made with precision tooling and high-grade materials.
                  </p>
                </div>

                {/* Price and Add button */}
                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Price</span>
                    <span className="text-base font-extrabold text-white">₹{product.price.toFixed(2)}</span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleAddToCart(product)}
                    disabled={buttonState.disabled}
                    className="font-semibold text-xs tracking-wide shadow-none"
                  >
                    {buttonState.text}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
