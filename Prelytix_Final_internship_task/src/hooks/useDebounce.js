import { useState, useEffect } from 'react';

/**
 * Reusable hook to debounce high-frequency state changes (such as keystroke inputs).
 * 
 * @param {*} value - The input value to debounce
 * @param {number} delay - Timeout delay in milliseconds
 * @returns {*} The debounced value
 */
export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timeout if value changes before delay window finishes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
