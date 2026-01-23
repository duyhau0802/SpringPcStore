import api from './api';

export const categoryAPI = {
  // Get all categories
  getAllCategories: () => api.get('/categories'),

  // Get category by ID
  getCategoryById: (id) => api.get(`/categories/${id}`),

  // Get subcategories by parent ID
  getSubcategories: (parentId) => api.get(`/categories/parent/${parentId}`),

  // Create category (admin only)
  createCategory: (categoryData) => api.post('/categories', categoryData),

  // Update category (admin only)
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),

  // Delete category (admin only)
  deleteCategory: (id) => api.delete(`/categories/${id}`)
};

export default categoryAPI;
