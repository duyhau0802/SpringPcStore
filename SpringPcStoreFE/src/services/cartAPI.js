import api from './api';

export const cartAPI = {
  // Get user's cart
  getCart: () => api.get('/cart'),

  // Add item to cart
  addItemToCart: (cartItemData) => api.post('/cart/items', cartItemData),

  // Update cart item quantity
  updateCartItemQuantity: (cartItemId, quantity) => 
    api.put(`/cart/items/${cartItemId}`, null, {
      params: { quantity }
    }),

  // Remove item from cart
  removeItemFromCart: (cartItemId) => 
    api.delete(`/cart/items/${cartItemId}`),

  // Clear entire cart
  clearCart: () => api.delete('/cart'),

  // Helper function to format cart item request
  formatCartItemRequest: (productId, storeId, quantity, price) => ({
    productId,
    storeId,
    quantity,
    price
  }),

  // Helper function to calculate cart totals
  calculateCartTotals: (cartItems) => {
    const totalPrice = cartItems.reduce((sum, item) => {
      const itemSubtotal = item.subtotal || (item.price * item.quantity);
      return sum + (itemSubtotal || 0);
    }, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    return {
      totalPrice,
      totalItems
    };
  }
};

export default cartAPI;
