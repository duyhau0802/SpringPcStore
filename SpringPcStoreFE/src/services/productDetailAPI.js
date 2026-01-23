import api from './api';

export const getProductById = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const getProductByIdWithDetails = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/details`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product with details:', error);
    throw error;
  }
};
