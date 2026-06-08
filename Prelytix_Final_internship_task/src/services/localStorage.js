const CART_STORAGE_KEY = 'aethercart_items';
const PROMO_STORAGE_KEY = 'aethercart_promo';

export const loadCartState = () => {
  try {
    const serializedItems = localStorage.getItem(CART_STORAGE_KEY);
    const serializedPromo = localStorage.getItem(PROMO_STORAGE_KEY);
    
    return {
      items: serializedItems ? JSON.parse(serializedItems) : [],
      promoCode: serializedPromo ? JSON.parse(serializedPromo) : null,
    };
  } catch (error) {
    console.error('Failed to load cart state from local storage:', error);
    return { items: [], promoCode: null };
  }
};

export const saveCartState = (items, promoCode) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(promoCode));
  } catch (error) {
    console.error('Failed to save cart state to local storage:', error);
  }
};
