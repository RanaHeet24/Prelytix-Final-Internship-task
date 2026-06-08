import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { selectAllProducts, selectSelectedCategory, setCategory } from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Star, Filter, Heart } from 'lucide-react';

const CATEGORIES = ['All', 'Audio', 'Accessories', 'Wearables', 'Video'];

export default function ProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const selectedCategory = useSelector(selectSelectedCategory);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to your cart!`, {
      icon: '🛒'
    });
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
        {filteredProducts.map(product => (
          <Card key={product.id} hoverEffect className="flex flex-col h-full group relative">
            {/* Visual gradient backdrop representing the product image */}
            <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${product.gradient} p-8 flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-white font-extrabold text-2xl tracking-wider drop-shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                {product.name.split(' ').map(w => w[0]).join('')}
              </span>
              <span className="absolute top-3 left-3 bg-black/35 backdrop-blur-md text-[10px] font-bold text-slate-200 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                {product.category}
              </span>
              <button className="absolute top-3 right-3 p-2 rounded-lg bg-black/35 backdrop-blur-md text-slate-400 hover:text-rose-400 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Product details */}
            <div className="mt-5 flex-grow flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-100 text-lg group-hover:text-indigo-300 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold">{product.rating}</span>
                  </div>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                  {product.description}
                </p>
              </div>

              {/* Price and Add button */}
              <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Price</span>
                  <span className="text-xl font-extrabold text-white">${product.price.toFixed(2)}</span>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleAddToCart(product)}
                  className="font-semibold text-xs tracking-wide shadow-none"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
