import { reviewAPI } from '../../services/reviewAPI';

export const FETCH_REVIEWS_REQUEST = 'FETCH_REVIEWS_REQUEST';
export const FETCH_REVIEWS_SUCCESS = 'FETCH_REVIEWS_SUCCESS';
export const FETCH_REVIEWS_FAILURE = 'FETCH_REVIEWS_FAILURE';

export const CREATE_REVIEW_REQUEST = 'CREATE_REVIEW_REQUEST';
export const CREATE_REVIEW_SUCCESS = 'CREATE_REVIEW_SUCCESS';
export const CREATE_REVIEW_FAILURE = 'CREATE_REVIEW_FAILURE';

// Fetch reviews by product ID
export const fetchReviewsByProductId = (productId) => async (dispatch) => {
  dispatch({ type: FETCH_REVIEWS_REQUEST });
  try {
    const response = await reviewAPI.getReviewsByProductId(productId);
    const reviews = response.data || [];
    
    dispatch({
      type: FETCH_REVIEWS_SUCCESS,
      payload: {
        productId,
        reviews
      }
    });
    
    return { success: true, reviews };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch reviews';
    dispatch({
      type: FETCH_REVIEWS_FAILURE,
      payload: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};

// Create a new review
export const createReview = (reviewData) => async (dispatch) => {
  dispatch({ type: CREATE_REVIEW_REQUEST });
  try {
    const response = await reviewAPI.createReview(reviewData);
    const review = response.data;
    
    dispatch({
      type: CREATE_REVIEW_SUCCESS,
      payload: review
    });
    
    return { success: true, review };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to create review';
    dispatch({
      type: CREATE_REVIEW_FAILURE,
      payload: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};
