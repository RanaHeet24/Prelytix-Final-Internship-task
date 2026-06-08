import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { selectCartItems, selectCartCalculations, clearCart } from '../features/cart/cartSlice';
import { 
  selectShippingInfo, 
  selectPaymentInfo, 
  selectCheckoutStatus,
  updateShippingInfo,
  updatePaymentInfo,
  submitOrderStart,
  submitOrderSuccess,
  submitOrderFailure,
  resetCheckoutStatus
} from '../features/checkout/checkoutSlice';
import { ROUTES } from '../constants/routes';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const calculations = useSelector(selectCartCalculations);
  
  const shippingInfo = useSelector(selectShippingInfo);
  const paymentInfo = useSelector(selectPaymentInfo);
  const { isSubmitting, orderSuccess, lastOrder } = useSelector(selectCheckoutStatus);

  const [formErrors, setFormErrors] = useState({});

  // Local Form Change Handlers
  const handleShippingChange = (e) => {
    const { id, value } = e.target;
    dispatch(updateShippingInfo({ [id]: value }));
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handlePaymentChange = (e) => {
    const { id, value } = e.target;
    dispatch(updatePaymentInfo({ [id]: value }));
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  // Form validator
  const validateForm = () => {
    const errors = {};
    if (!shippingInfo.fullName) errors.fullName = 'Full Name is required';
    if (!shippingInfo.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      errors.email = 'Email is invalid';
    }
    if (!shippingInfo.address) errors.address = 'Address is required';
    if (!shippingInfo.city) errors.city = 'City is required';
    if (!shippingInfo.postalCode) errors.postalCode = 'Postal code is required';
    if (!shippingInfo.country) errors.country = 'Country is required';

    if (!paymentInfo.cardHolder) errors.cardHolder = 'Cardholder name is required';
    if (!paymentInfo.cardNumber) {
      errors.cardNumber = 'Card number is required';
    } else if (paymentInfo.cardNumber.replace(/\s/g, '').length < 16) {
      errors.cardNumber = 'Card number must be 16 digits';
    }
    if (!paymentInfo.expiryDate) errors.expiryDate = 'Expiry is required';
    if (!paymentInfo.cvc) {
      errors.cvc = 'CVC is required';
    } else if (paymentInfo.cvc.length < 3) {
      errors.cvc = 'CVC is invalid';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warn('Please fill out all required fields correctly.');
      return;
    }

    dispatch(submitOrderStart());
    
    // Simulate API call for order placement
    setTimeout(() => {
      const orderId = `AC-${Math.floor(100000 + Math.random() * 900000)}`;
      dispatch(submitOrderSuccess({
        orderId,
        itemsCount: cartItems.length,
        total: calculations.total,
        shippingAddress: shippingInfo.address,
      }));
      toast.success('Order placed successfully! Thank you for shopping.');
    }, 2000);
  };

  const handleReturnToStore = () => {
    dispatch(clearCart());
    dispatch(resetCheckoutStatus());
    navigate(ROUTES.PRODUCTS);
  };

  // If order was successfully completed
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <Card className="text-center p-8 sm:p-12 space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Order Confirmed!</h2>
            <p className="text-slate-400 text-sm">
              Your transaction has processed successfully. We've sent an invoice to your registered email.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto">
            <div className="flex justify-between border-b border-white/5 pb-3 text-xs uppercase tracking-wider text-slate-500">
              <span>Order Details</span>
              <span className="font-semibold text-indigo-400">{lastOrder?.orderId}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Items Count:</span>
                <span className="font-semibold text-slate-200">{lastOrder?.itemsCount} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Address:</span>
                <span className="font-semibold text-slate-200 truncate max-w-[200px]">{lastOrder?.shippingAddress}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5 font-extrabold text-white">
                <span>Charged Total:</span>
                <span className="text-indigo-400">₹{lastOrder?.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleReturnToStore} className="font-semibold text-xs tracking-wider px-8">
              Return to Store
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
        <h2 className="text-2xl font-bold text-white">Checkout is empty</h2>
        <p className="text-slate-400 text-sm max-w-xs">
          You don't have any items to check out. Please add products to your cart.
        </p>
        <Link to={ROUTES.PRODUCTS}>
          <Button variant="outline" className="font-semibold text-xs tracking-wider">
            Explore Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Link to={ROUTES.CART} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-white">Checkout</h1>
          <p className="text-slate-400 text-sm">Secure credit card and delivery coordination console.</p>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forms column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping details */}
          <Card className="space-y-6">
            <h2 className="font-bold text-lg text-slate-100 flex items-center gap-2 border-b border-white/5 pb-4">
              <Truck className="w-5 h-5 text-indigo-400" />
              Shipping Coordinates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                id="fullName"
                value={shippingInfo.fullName}
                onChange={handleShippingChange}
                error={formErrors.fullName}
                required
              />
              <Input
                label="Email Address"
                id="email"
                type="email"
                value={shippingInfo.email}
                onChange={handleShippingChange}
                error={formErrors.email}
                required
              />
              <Input
                label="Delivery Address"
                id="address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                error={formErrors.address}
                required
                className="sm:col-span-2"
              />
              <Input
                label="City"
                id="city"
                value={shippingInfo.city}
                onChange={handleShippingChange}
                error={formErrors.city}
                required
              />
              <Input
                label="Postal Code"
                id="postalCode"
                value={shippingInfo.postalCode}
                onChange={handleShippingChange}
                error={formErrors.postalCode}
                required
              />
              <Input
                label="Country"
                id="country"
                value={shippingInfo.country}
                onChange={handleShippingChange}
                error={formErrors.country}
                required
                className="sm:col-span-2"
              />
            </div>
          </Card>

          {/* Payment Info */}
          <Card className="space-y-6">
            <h2 className="font-bold text-lg text-slate-100 flex items-center gap-2 border-b border-white/5 pb-4">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              Secure Payment Module
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Cardholder Name"
                id="cardHolder"
                value={paymentInfo.cardHolder}
                onChange={handlePaymentChange}
                error={formErrors.cardHolder}
                required
                className="sm:col-span-2"
              />
              <Input
                label="Card Number"
                id="cardNumber"
                placeholder="xxxx xxxx xxxx xxxx"
                value={paymentInfo.cardNumber}
                onChange={handlePaymentChange}
                error={formErrors.cardNumber}
                required
                className="sm:col-span-2"
              />
              <Input
                label="Expiry Date"
                id="expiryDate"
                placeholder="MM/YY"
                value={paymentInfo.expiryDate}
                onChange={handlePaymentChange}
                error={formErrors.expiryDate}
                required
              />
              <Input
                label="CVC Code"
                id="cvc"
                placeholder="•••"
                type="password"
                maxLength={4}
                value={paymentInfo.cvc}
                onChange={handlePaymentChange}
                error={formErrors.cvc}
                required
              />
            </div>
          </Card>
        </div>

        {/* Pricing column */}
        <div className="space-y-6">
          <Card className="space-y-6">
            <h2 className="font-bold text-lg text-slate-100 border-b border-white/5 pb-4">
              Review Items
            </h2>

            {/* List items briefly */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-semibold text-slate-200 block">{item.name}</span>
                    <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-semibold text-indigo-400">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Order totals */}
            <div className="border-t border-white/5 pt-4 space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>₹{calculations.subtotal.toFixed(2)}</span>
              </div>
              
              {calculations.productDiscount > 0 && (
                <div className="flex justify-between text-indigo-300">
                  <span>Product Discount (Rule 1)</span>
                  <span>-₹{calculations.productDiscount.toFixed(2)}</span>
                </div>
              )}

              {calculations.cartDiscount > 0 && (
                <div className="flex justify-between text-indigo-400">
                  <span>Cart Discount (Rule 2)</span>
                  <span>-₹{calculations.cartDiscount.toFixed(2)}</span>
                </div>
              )}

              {calculations.promoDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Discount</span>
                  <span>-₹{calculations.promoDiscountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Est. Tax (8%)</span>
                <span>₹{calculations.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping cost</span>
                <span>{calculations.shipping === 0 ? 'FREE' : `₹${calculations.shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-white/5 pt-4 flex justify-between text-base font-extrabold text-white">
                <span>Final Total</span>
                <span className="text-xl text-indigo-400">₹{calculations.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                isLoading={isSubmitting}
                className="w-full font-bold flex items-center justify-center space-x-2 py-3"
              >
                <span>Authorize & Pay</span>
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>AES-256 Bit SSL Protocol Encrypted</span>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
