import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCT_REQUEST,
  FETCH_PRODUCT_SUCCESS,
  FETCH_PRODUCT_FAILURE,
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_BY_CATEGORY_REQUEST,
  FETCH_PRODUCTS_BY_CATEGORY_SUCCESS,
  FETCH_PRODUCTS_BY_CATEGORY_FAILURE,
} from '../actions/productActions';

const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalElements: 0,
    size: 12,
    first: true,
    last: true
  },
  searchParams: {},
  categoryProducts: {} // Store products by category
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
    case SEARCH_PRODUCTS_REQUEST:
    case FETCH_PRODUCTS_BY_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        pagination: action.payload.pagination,
        error: null
      };

    case SEARCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        pagination: action.payload.pagination,
        searchParams: action.payload.searchParams,
        error: null
      };

    case FETCH_PRODUCTS_BY_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categoryProducts: {
          ...state.categoryProducts,
          [action.payload.categoryId]: action.payload.products
        },
        error: null
      };

    case FETCH_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        currentProduct: null,
        error: null
      };

    case FETCH_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        currentProduct: action.payload,
        error: null
      };

    case FETCH_PRODUCTS_FAILURE:
    case SEARCH_PRODUCTS_FAILURE:
    case FETCH_PRODUCTS_BY_CATEGORY_FAILURE:
    case FETCH_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default productReducer;
