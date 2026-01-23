import { productAPI } from '../../services/productAPI';

export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

export const FETCH_PRODUCT_REQUEST = 'FETCH_PRODUCT_REQUEST';
export const FETCH_PRODUCT_SUCCESS = 'FETCH_PRODUCT_SUCCESS';
export const FETCH_PRODUCT_FAILURE = 'FETCH_PRODUCT_FAILURE';

export const SEARCH_PRODUCTS_REQUEST = 'SEARCH_PRODUCTS_REQUEST';
export const SEARCH_PRODUCTS_SUCCESS = 'SEARCH_PRODUCTS_SUCCESS';
export const SEARCH_PRODUCTS_FAILURE = 'SEARCH_PRODUCTS_FAILURE';

export const FETCH_PRODUCTS_BY_CATEGORY_REQUEST = 'FETCH_PRODUCTS_BY_CATEGORY_REQUEST';
export const FETCH_PRODUCTS_BY_CATEGORY_SUCCESS = 'FETCH_PRODUCTS_BY_CATEGORY_SUCCESS';
export const FETCH_PRODUCTS_BY_CATEGORY_FAILURE = 'FETCH_PRODUCTS_BY_CATEGORY_FAILURE';

// Fetch all products with pagination
export const fetchProducts = (params = {}) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_REQUEST });
  try {
    const response = await productAPI.getAllProducts(params);
    const products = productAPI.extractProducts(response);
    const pagination = productAPI.getPaginationInfo(response);
    
    dispatch({
      type: FETCH_PRODUCTS_SUCCESS,
      payload: {
        products,
        pagination,
        currentPage: pagination.currentPage
      }
    });
    
    return { success: true, products, pagination };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch products';
    dispatch({
      type: FETCH_PRODUCTS_FAILURE,
      payload: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};

// Fetch single product by ID
export const fetchProduct = (id) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCT_REQUEST });
  try {
    const response = await productAPI.getProductByIdWithDetails(id);
    const product = response.data;
    
    dispatch({
      type: FETCH_PRODUCT_SUCCESS,
      payload: product
    });
    
    return { success: true, product };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch product';
    dispatch({
      type: FETCH_PRODUCT_FAILURE,
      payload: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};

// Search products
export const searchProducts = (searchParams) => async (dispatch) => {
  dispatch({ type: SEARCH_PRODUCTS_REQUEST });
  try {
    const response = await productAPI.searchProducts(searchParams);
    const products = productAPI.extractProducts(response);
    const pagination = productAPI.getPaginationInfo(response);
    
    dispatch({
      type: SEARCH_PRODUCTS_SUCCESS,
      payload: {
        products,
        pagination,
        searchParams
      }
    });
    
    return { success: true, products, pagination };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to search products';
    dispatch({
      type: SEARCH_PRODUCTS_FAILURE,
      payload: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};

// Fetch products by category
export const fetchProductsByCategory = (categoryId) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_BY_CATEGORY_REQUEST });
  try {
    const response = await productAPI.getProductsByCategory(categoryId);
    const products = response.data;
    
    dispatch({
      type: FETCH_PRODUCTS_BY_CATEGORY_SUCCESS,
      payload: {
        categoryId,
        products
      }
    });
    
    return { success: true, products };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch products by category';
    dispatch({
      type: FETCH_PRODUCTS_BY_CATEGORY_FAILURE,
      payload: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};
