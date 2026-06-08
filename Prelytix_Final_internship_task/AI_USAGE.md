# AI Usage Log

This document records the utilization of AI tools, generated code templates, and developer modifications made during the implementation of the AetherCart platform.

---

## 🛠️ AI Tools Used
- **Antigravity (Google DeepMind)**: Used for architecture generation, state-slice boilerplate scaffolding, pure functional mathematical calculators, custom React hooks, and general stylesheet adjustments.

---

## 🎯 Purpose of Usage
1. **Scaffolding**: Quick set up of the Redux Toolkit slices (`cartSlice.js`, `productsSlice.js`, `checkoutSlice.js`) and Vite React routing structure.
2. **Business Logic Isolation**: Architecting clean, pure discount engine algorithms (`discountCalculator.js`) conforming to the strict engineering guidelines (no side-effects, fully unit testable).
3. **Performance Optimization**: Scaffolding the `useDebounce` hook to restrict rapid Redux store updates on product search inputs.

---

## 💻 Generated Code Sections & Modifications

### 1. State Management & Middleware Scaffolding
- **Initial Generation**: Redux slice reducer boilerplate and default state keys.
- **Modifications**: Added custom validations to prevent adding items exceeding stock constraints, mapped quantity limits to 10, and added `localStorageMiddleware` for saving cart states dynamically.

### 2. Standalone Discount Engine (`src/utils/discountCalculator.js`)
- **Initial Generation**: Subtotal and tax rate formulas.
- **Modifications**: Implemented the strict stacked order of discount rules:
  1. Product bulk discounts ($\ge 3$ quantity gets 10% off product subtotal).
  2. Cart discount (additional 5% off if subtotal exceeds ₹5000).
  3. Promo coupon code processing (20% off post-discount subtotal).
  4. Free shipping limits computed on the taxable total (taxable $> 5000$ sets shipping to free).

### 3. Custom Debounce Hook (`src/hooks/useDebounce.js`)
- **Initial Generation**: Standard timeout handler.
- **Modifications**: Ensured clean cleanup of timeouts upon component unmounting or input modifications, preventing memory leaks and unnecessary component updates.
