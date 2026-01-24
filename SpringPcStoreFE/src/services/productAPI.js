import api from './api';

export const productAPI = {
  // Get all products with pagination
  getAllProducts: (params = {}) => {
    const {
      page = 0,
      size = 12,
      sort = 'id,desc',
      ...otherParams
    } = params;
    
    return api.get('/products', {
      params: {
        page,
        size,
        sort,
        ...otherParams
      }
    });
  },

  // Get product by ID
  getProductById: (id) => api.get(`/products/${id}`),

  // Get product by ID with details (images, specs, inventory)
  getProductByIdWithDetails: (id) => api.get(`/products/${id}/details`),

  // Search products
  searchProducts: (searchParams = {}) => {
    const {
      name,
      categoryId,
      brandId,
      storeId,
      status = 'ACTIVE',
      minRating,
      minPrice,
      maxPrice,
      page = 0,
      size = 12,
      sort = 'id,desc'
    } = searchParams;

    return api.get('/products/search', {
      params: {
        name,
        categoryId,
        brandId,
        storeId,
        status,
        minRating,
        minPrice,
        maxPrice,
        page,
        size,
        sort
      }
    });
  },

  // Get products by store
  getProductsByStore: (storeId) => api.get(`/products/store/${storeId}`),

  // Get products by category
  getProductsByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),

  // Create product (admin/store owner only)
  createProduct: (productData) => api.post('/products', productData),

  // Update product (admin/store owner only)
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),

  // Delete product (admin/store owner only)
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // Helper function to extract products from paginated response
  extractProducts: (response) => {
    return response.data.content || response.data;
  },

  // Helper function to get pagination info
  getPaginationInfo: (response) => {
    const data = response.data;
    return {
      currentPage: data.number + 1,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      size: data.size,
      first: data.first,
      last: data.last
    };
  }
};

export default productAPI;
