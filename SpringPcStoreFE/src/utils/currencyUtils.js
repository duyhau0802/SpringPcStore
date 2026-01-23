// Currency formatting utilities for Tech Store

/**
 * Format price to 2 decimal places (fixes floating point issues)
 * @param {number} price - The price to format
 * @returns {number} - Formatted price with 2 decimal places
 */
export const formatPrice = (price) => {
  return Math.round(Number(price) * 100) / 100;
};

/**
 * Calculate original price with markup
 * @param {number} price - Base price
 * @param {number} markupPercentage - Markup percentage (default 10%)
 * @returns {number} - Original price with markup
 */
export const calculateOriginalPrice = (price, markupPercentage = 10) => {
  const multiplier = 1 + (markupPercentage / 100);
  return Math.round(Number(price) * multiplier * 100) / 100;
};

/**
 * Calculate discount price
 * @param {number} price - Base price
 * @param {number} discountPercentage - Discount percentage (default 10%)
 * @returns {number} - Discount amount
 */
export const calculateDiscountPrice = (price, discountPercentage = 10) => {
  return Math.round(Number(price) * (discountPercentage / 100) * 100) / 100;
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol (default $)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = '$') => {
  const formattedPrice = formatPrice(amount);
  return `${currency}${formattedPrice.toFixed(2)}`;
};

/**
 * Format price without currency symbol (for components that add $)
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted price string with 2 decimal places
 */
export const formatPriceDisplay = (amount) => {
  const formattedPrice = formatPrice(amount);
  return formattedPrice.toFixed(2);
};

/**
 * Check if price qualifies for free shipping
 * @param {number} price - Product price
 * @param {number} threshold - Free shipping threshold (default 100)
 * @returns {boolean} - Whether price qualifies for free shipping
 */
export const qualifiesForFreeShipping = (price, threshold = 100) => {
  return Number(price) >= threshold;
};

export default {
  formatPrice,
  calculateOriginalPrice,
  calculateDiscountPrice,
  formatCurrency,
  formatPriceDisplay,
  qualifiesForFreeShipping
};
