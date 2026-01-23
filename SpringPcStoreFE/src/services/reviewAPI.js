import api from './api';

export const reviewAPI = {
  // Get reviews by product ID
  getReviewsByProductId: (productId) => {
    return api.get(`/reviews/product/${productId}/details`);
  },

  // Create a new review
  createReview: (reviewData) => {
    return api.post('/reviews', reviewData);
  },

  // Update a review
  updateReview: (reviewId, reviewData) => {
    return api.put(`/reviews/${reviewId}`, reviewData);
  },

  // Delete a review
  deleteReview: (reviewId) => {
    return api.delete(`/reviews/${reviewId}`);
  },

  // Get reviews by user ID
  getReviewsByUserId: (userId) => {
    return api.get(`/reviews/user/${userId}`);
  },

  // Get all reviews (admin)
  getAllReviews: (params = {}) => {
    return api.get('/reviews', { params });
  }
};

export default reviewAPI;
