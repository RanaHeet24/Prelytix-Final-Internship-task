# AetherCart - Premium Smart Cart & Discount Engine

AetherCart is a high-performance, enterprise-grade e-commerce checkout and product curation interface built using React 19, Vite, Redux Toolkit, and Tailwind CSS. The app features state-hydrated local persistence, a standalone pure-functional discount engine, debounced search filters, category selectors, stock threshold validations, and a fully polished, responsive UI.

---

## 🚀 Key Features

1. **Premium Responsive User Interface**
   - High-end dark mode dashboard styling using premium typography, glassmorphism overlays, custom card grids, and smooth transitions.
   - Dynamic micro-interactions including card hover scales and loading spinner micro-states.

2. **Debounced Product Search & Filters**
   - Full-text search by product name with a custom `useDebounce` hook to avoid performance lag or excessive selector triggers.
   - Categorized tag filters (Audio, Accessories, Wearables, Video, and All).
   - Ordering options (Price Low-to-High, Price High-to-Low, Name A-Z).

3. **Cart Management & Stock Threshold Validations**
   - Boundary validations (Minimum quantity = 1, Maximum quantity = 10).
   - Real-time stock reservation sync (cannot add items beyond catalog stock capacity; buttons automatically disable and warn with toast feedback).
   - "Bulk Purchase" high-light badges on items with a quantity of 5 or more.
   - Persistent Cart matching state-level updates to `localStorage` automatically using a custom Redux middleware.

4. **Standalone Decoupled Discount Engine**
   - Decoupled calculations in `src/utils/discountCalculator.js` allowing unit test execution without React UI dependencies.
   - **Discount Rule 1 (Bulk Subtotal)**: 10% discount on any individual product subtotal if the quantity of that item is $\ge 3$.
   - **Discount Rule 2 (Large Order)**: Additional 5% discount on the remaining subtotal if the value exceeds ₹5000 (applied post-Rule 1).
   - **Promo Code Coupons**: Inputting code `SMARTCART20` applies an extra 20% discount on the taxable subtotal.
   - **Tax and Shipping Calculations**: Stable 8% tax rate. Flat ₹15 shipping fee which automatically transitions to free shipping when the taxable subtotal exceeds ₹5000.

---

## 🏗️ Project Architecture

We enforce a highly scalable, feature-centric directory structure keeping visual components separated from business algorithms:

```text
src/
  app/              # Global application setup (Redux store, middleware)
  features/         # Feature state slices (cart, products, checkout)
  components/       # Reusable layout & UI design tokens (Card, Button, Input)
  pages/            # View pages (Products, Cart, Checkout)
  hooks/            # Custom hooks (e.g. useDebounce)
  utils/            # Pure helper utilities (discountCalculator)
  data/             # Mock database catalog (products.json)
  constants/        # Route lists & constant variables
  services/         # API or storage access wrappers (localStorage)
```

---

## 💾 State Management Choice

- **Redux Toolkit**: Chosen as the primary state hub for predictable multi-page state coordination. This handles Cart quantity updates, checkout shipping/payment forms, and catalog sorting filters efficiently.
- **Custom LocalStorage Middleware**: Auto-serializes cart updates to local storage, hydrating the client on page reloads without triggering UI state mismatches.
- **Memoized Selectors (`createSelector`)**: Optimizes re-render behaviors by caching calculation matrices (e.g. subtotals, taxes, and shipping) unless the cart array or active coupon modifications occur.

---

## 📋 Assumptions
- **Catalog Stock Consistency**: Catalog stocks represent real-time absolute limits. A user cannot exceed this limit even if they wish to purchase less than the maximum boundary of 10.
- **Stacked Calculations Order**:
  1. Calculate raw subtotals.
  2. Apply item-level 10% discounts for items with quantities $\ge 3$ (Rule 1).
  3. Calculate subtotal after product discount.
  4. Apply cart discount of 5% if this subtotal exceeds ₹5000 (Rule 2).
  5. Apply promo code (20%) on subtotal after previous discounts.
  6. Calculate taxable amount, then apply 8% tax.
  7. Apply ₹15 shipping, unless the taxable amount is $> 5000$ (in which case it is free).

---

## 🛠️ Challenges & Workarounds
- **Strict Stock vs. Max limit constraints**: Validating stock and max limit increments simultaneously. We solved this by mapping item counters in Redux against both static catalog boundaries and current state indexes, producing granular validation alerts.
- **Stacked Discount Accumulation**: Stacking Rule 2 and coupon codes could result in double-discount errors. Separating calculations into isolated steps and mapping them inside pure math functions prevents decimal compound mistakes.

---

## 🛑 Known Issues & Future Improvements
- **Stripe / Payment Integration**: Payments are currently simulated via mock timeouts. Connecting a sandbox payment API is a future goal.
- **Interactive Stock Hydration**: Out-of-stock items update dynamically in state, but a real inventory database sync via WebSockets would prevent stock race conditions.
