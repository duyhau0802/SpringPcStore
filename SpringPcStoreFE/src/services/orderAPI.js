import api from './api';

export const orderAPI = {
  // Create a new order
  createOrder: (orderData) => api.post('/orders', orderData),

  // Get all orders (admin only)
  getAllOrders: (params = {}) => api.get('/orders', { params }),

  // Get order by ID
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),

  // Get current user's orders
  getMyOrders: (params = {}) => api.get('/orders/my', { params }),

  // Get current user's orders (paginated)
  getMyOrdersPaged: (params = {}) => api.get('/orders/my/paged', { params }),

  // Get orders by status (admin only)
  getOrdersByStatus: (status) => api.get(`/orders/status/${status}`),

  // Update order status (admin only)
  updateOrderStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, null, { params: { status } }),

  // Cancel order
  cancelOrder: (orderId) => api.put(`/orders/${orderId}/cancel`),

  // Helper function to format order request
  formatOrderRequest: (totalPrice, shippingAddress, cartItems) => ({
    totalPrice,
    shippingAddress,
    orderItems: cartItems.map(item => ({
      productId: item.productId,
      storeId: item.storeId,
      price: item.price,
      quantity: item.quantity
    }))
  })
};

export default orderAPI;
