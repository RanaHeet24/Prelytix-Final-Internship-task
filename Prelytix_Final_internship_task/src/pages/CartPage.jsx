import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  selectCartItems, 
  selectCartCalculations, 
  selectCartPromo, 
  selectCartDiscount,
  removeFromCart, 
  incrementQuantity,
  decrementQuantity,
  applyPromoCode 
} from '../features/cart/cartSlice';
import { ROUTES } from '../constants/routes';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Ticket, Flame } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const calculations = useSelector(selectCartCalculations);
  const activePromo = useSelector(selectCartPromo);
  const discountRate = useSelector(selectCartDiscount);

  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    dispatch(applyPromoCode(promoInput));
    if (promoInput.toUpperCase() === 'SMARTCART20') {
      toast.success('Promo code applied successfully! 20% discount added.');
    } else {
      toast.error('Invalid promo code. Try "SMARTCART20".');
    }
  };

  const handleIncrement = (id, currentQty, stock, name) => {
    if (currentQty >= 10) {
      toast.warn(`Maximum limit of 10 items reached for ${name}.`);
      return;
    }
    if (currentQty >= stock) {
      toast.warn(`Cannot add more. Only ${stock} items are in stock.`);
      return;
    }
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = (id, currentQty) => {
    if (currentQty <= 1) return;
    dispatch(decrementQuantity(id));
  };

  const handleRemoveItem = (id, name) => {
    dispatch(removeFromCart(id));
    toast.info(`${name} removed from your cart.`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 animate-bounce">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
          <p className="text-slate-400 text-sm max-w-sm">
            Looks like you haven't added anything to your cart yet. Explore our premium collection!
          </p>
        </div>
        <Link to={ROUTES.PRODUCTS}>
          <Button variant="outline" className="font-semibold text-xs tracking-wider">
            Go Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Shopping Cart</h1>
        <p className="text-slate-400 text-sm mt-1">
          Review your selected items and promotional codes before checking out.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-5">
              {/* Product Badge / Name */}
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-lg bg-slate-950 border border-white/5 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-100 text-base">{item.name}</h3>
                    {item.quantity >= 5 && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-lg uppercase tracking-wider">
                        <Flame className="w-2.5 h-2.5 text-indigo-400" />
                        Bulk Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-indigo-400 font-medium block">{item.category}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-6 sm:gap-8 flex-grow">
                {/* Quantity adjuster */}
                <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 rounded-lg p-1.5">
                  <button 
                    onClick={() => handleDecrement(item.id, item.quantity)}
                    disabled={item.quantity <= 1}
                    className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-md cursor-pointer transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-slate-200">{item.quantity}</span>
                  <button 
                    onClick={() => handleIncrement(item.id, item.quantity, item.stock, item.name)}
                    disabled={item.quantity >= 10 || item.quantity >= item.stock}
                    className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-md cursor-pointer transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Price display */}
                <div className="text-right sm:min-w-[80px]">
                  <span className="text-xs text-slate-500 block">Unit Price</span>
                  <span className="font-bold text-slate-100">${item.price.toFixed(2)}</span>
                </div>

                {/* Total Price */}
                <div className="text-right sm:min-w-[90px]">
                  <span className="text-xs text-slate-500 block">Total</span>
                  <span className="font-extrabold text-indigo-400">${(item.price * item.quantity).toFixed(2)}</span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => handleRemoveItem(item.id, item.name)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl cursor-pointer transition-all border border-transparent hover:border-rose-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary sidebar */}
        <div className="space-y-6">
          <Card className="space-y-6">
            <h2 className="font-bold text-lg text-slate-100 border-b border-white/5 pb-4">
              Order Summary
            </h2>

            {/* Calculations items */}
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-medium text-slate-200">${calculations.subtotal.toFixed(2)}</span>
              </div>

              {activePromo && (
                <div className="flex justify-between text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5" />
                    Discount ({(discountRate * 100)}%)
                  </span>
                  <span>-${calculations.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Est. Tax (8%)</span>
                <span className="font-medium text-slate-200">${calculations.tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="font-medium text-slate-200">
                  {calculations.shipping === 0 ? 'FREE' : `$${calculations.shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="border-t border-white/5 pt-4 flex justify-between text-base font-extrabold text-white">
                <span>Grand Total</span>
                <span className="text-xl text-indigo-400">${calculations.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Code section */}
            <form onSubmit={handleApplyPromo} className="border-t border-white/5 pt-4 space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter SMARTCART20"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" variant="secondary" className="px-4">
                  Apply
                </Button>
              </div>
              {activePromo ? (
                <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  Active Code: <span className="underline">{activePromo.toUpperCase()}</span>
                </p>
              ) : (
                <p className="text-[10px] text-slate-500 italic">
                  Tip: Try applying "SMARTCART20" code for a 20% discount.
                </p>
              )}
            </form>

            {/* Checkout action */}
            <div className="pt-2">
              <Button 
                onClick={() => navigate(ROUTES.CHECKOUT)}
                className="w-full font-bold flex items-center justify-center space-x-2 py-3"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
