import { getProductById, getProductByIdWithDetails } from '../../services/productDetailAPI';

export const FETCH_PRODUCT_DETAIL_REQUEST = 'FETCH_PRODUCT_DETAIL_REQUEST';
export const FETCH_PRODUCT_DETAIL_SUCCESS = 'FETCH_PRODUCT_DETAIL_SUCCESS';
export const FETCH_PRODUCT_DETAIL_FAILURE = 'FETCH_PRODUCT_DETAIL_FAILURE';

export const fetchProductDetail = (productId) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PRODUCT_DETAIL_REQUEST });
    
    try {
      const product = await getProductByIdWithDetails(productId);
      dispatch({
        type: FETCH_PRODUCT_DETAIL_SUCCESS,
        payload: product
      });
    } catch (error) {
      dispatch({
        type: FETCH_PRODUCT_DETAIL_FAILURE,
        payload: error.message
      });
    }
  };
};
