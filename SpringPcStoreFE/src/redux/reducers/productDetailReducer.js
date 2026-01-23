import {
  FETCH_PRODUCT_DETAIL_REQUEST,
  FETCH_PRODUCT_DETAIL_SUCCESS,
  FETCH_PRODUCT_DETAIL_FAILURE
} from '../actions/productDetailActions';

const initialState = {
  product: null,
  loading: false,
  error: null
};

const productDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCT_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case FETCH_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        product: action.payload,
        error: null
      };
    
    case FETCH_PRODUCT_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        product: null,
        error: action.payload
      };
    
    default:
      return state;
  }
};

export default productDetailReducer;
