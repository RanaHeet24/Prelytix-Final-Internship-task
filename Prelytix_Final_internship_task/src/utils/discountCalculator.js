/**
 * Pure functions for discount and totals calculation.
 * No side effects, fully testable, and independent of React/UI state.
 */

/**
 * Calculates item-specific discounts (Rule 1).
 * If quantity of same product >= 3, apply a 10% discount on that product's subtotal.
 * 
 * @param {Array} items - Array of cart items: { price, quantity, ... }
 * @returns {number} The total sum of all product-specific discounts
 */
export const calculateProductDiscount = (items = []) => {
  if (!Array.isArray(items)) return 0;
  
  return items.reduce((totalDiscount, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    
    if (quantity >= 3) {
      // 10% discount on this product subtotal
      const productSubtotal = price * quantity;
      return totalDiscount + (productSubtotal * 0.10);
    }
    
    return totalDiscount;
  }, 0);
};

/**
 * Calculates cart-level discount based on cart value (Rule 2).
 * If cart value exceeds ₹5000, apply an additional 5% discount after product discounts.
 * 
 * @param {number} subtotalAfterProductDiscount - Subtotal after product discounts
 * @returns {number} Additional 5% discount amount if threshold exceeded
 */
export const calculateCartDiscount = (subtotalAfterProductDiscount = 0) => {
  const value = Number(subtotalAfterProductDiscount) || 0;
  if (value > 5000) {
    return value * 0.05; // 5% discount
  }
  return 0;
};

/**
 * Calculates the final payable amount including discounts, tax, and shipping.
 * 
 * @param {number} subtotal - The raw subtotal of items
 * @param {number} productDiscount - The sum of product-level discounts (Rule 1)
 * @param {number} cartDiscount - The cart value-based discount (Rule 2)
 * @param {number} promoDiscount - The promo code discount
 * @param {number} taxRate - Tax percentage (e.g. 0.08 for 8%)
 * @param {number} shippingCost - Flat rate shipping fee
 * @returns {number} The final amount to be paid
 */
export const calculateFinalAmount = (
  subtotal = 0,
  productDiscount = 0,
  cartDiscount = 0,
  promoDiscount = 0,
  taxRate = 0.08,
  shippingCost = 15.00
) => {
  const rawSubtotal = Number(subtotal) || 0;
  const prodDisc = Number(productDiscount) || 0;
  const cDisc = Number(cartDiscount) || 0;
  const pDisc = Number(promoDiscount) || 0;
  
  // Taxable amount is subtotal minus all applied discounts
  const taxableAmount = Math.max(0, rawSubtotal - prodDisc - cDisc - pDisc);
  const tax = taxableAmount * (Number(taxRate) || 0);
  
  // Free shipping threshold if remaining cart value exceeds ₹5000 (after discounts)
  const shipping = taxableAmount > 5000 || taxableAmount === 0 ? 0 : (Number(shippingCost) || 0);
  
  return taxableAmount + tax + shipping;
};

/**
 * Generates the complete checkout summary.
 * Integrates all pure calculation functions.
 * 
 * @param {Array} items - Cart items list
 * @param {Object} options - Calculation options: { promoDiscountRate, taxRate, shippingCost }
 * @returns {Object} Checkout summary calculations breakdown
 */
export const calculateCheckoutSummary = (items = [], options = {}) => {
  const promoDiscountRate = Number(options.promoDiscountRate) || 0;
  const taxRate = typeof options.taxRate === 'number' ? options.taxRate : 0.08;
  const shippingCost = typeof options.shippingCost === 'number' ? options.shippingCost : 15.00;

  if (!Array.isArray(items) || items.length === 0) {
    return {
      subtotal: 0,
      productDiscount: 0,
      subtotalAfterProductDiscount: 0,
      cartDiscount: 0,
      promoDiscountAmount: 0,
      totalDiscount: 0,
      taxableAmount: 0,
      tax: 0,
      shipping: 0,
      total: 0
    };
  }

  // 1. Raw Subtotal
  const subtotal = items.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);

  // 2. Product-specific discounts (Rule 1: qty >= 3 gets 10% off)
  const productDiscount = calculateProductDiscount(items);

  // 3. Subtotal after Rule 1 discounts
  const subtotalAfterProductDiscount = Math.max(0, subtotal - productDiscount);

  // 4. Cart value-based discount (Rule 2: > 5000 gets 5% off)
  const cartDiscount = calculateCartDiscount(subtotalAfterProductDiscount);

  // 5. Promo Code Discount
  const promoDiscountAmount = subtotalAfterProductDiscount * promoDiscountRate;

  // 6. Total discount sum
  const totalDiscount = productDiscount + cartDiscount + promoDiscountAmount;

  // 7. Net taxable amount
  const taxableAmount = Math.max(0, subtotal - totalDiscount);

  // 8. Tax calculations
  const tax = taxableAmount * taxRate;

  // 9. Shipping cost
  const shipping = taxableAmount > 5000 ? 0 : shippingCost;

  // 10. Grand total payable
  const total = taxableAmount + tax + shipping;

  return {
    subtotal,
    productDiscount,
    subtotalAfterProductDiscount,
    cartDiscount,
    promoDiscountAmount,
    totalDiscount,
    taxableAmount,
    tax,
    shipping,
    total
  };
};
