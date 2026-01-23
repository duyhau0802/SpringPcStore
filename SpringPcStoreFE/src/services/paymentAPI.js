import api from './api';

export const paymentAPI = {
  // Create a new payment
  createPayment: (paymentData) => api.post('/payments', paymentData),

  // Get payment by ID
  getPaymentById: (paymentId) => api.get(`/payments/${paymentId}`),

  // Get payments by order ID
  getPaymentsByOrderId: (orderId) => api.get(`/payments/order/${orderId}`),

  // Update payment status
  updatePaymentStatus: (paymentId, status) => api.put(`/payments/${paymentId}/status`, null, { params: { status } }),

  // Helper function to format payment request
  formatPaymentRequest: (orderId, method, amount, paymentDetails) => ({
    orderId,
    method,
    amount,
    paymentDetails
  }),

  // Helper function to generate payment details for different methods
  generatePaymentDetails: (method, cardInfo) => {
    switch (method) {
      case 'COD':
        return 'Cash on Delivery';
      case 'CREDIT_CARD':
        return cardInfo ? `Visa ending in ${cardInfo.cardNumber?.slice(-4) || '4242'}` : 'Credit Card';
      case 'PAYPAL':
        return 'PayPal';
      default:
        return 'Unknown Payment Method';
    }
  }
};

export default paymentAPI;
