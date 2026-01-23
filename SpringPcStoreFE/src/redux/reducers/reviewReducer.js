import {
  FETCH_REVIEWS_REQUEST,
  FETCH_REVIEWS_SUCCESS,
  FETCH_REVIEWS_FAILURE,
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  CREATE_REVIEW_FAILURE
} from '../actions/reviewActions';

const initialState = {
  reviews: {},
  loading: false,
  error: null,
  creatingReview: false,
  createReviewError: null
};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REVIEWS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_REVIEWS_SUCCESS:
      return {
        ...state,
        loading: false,
        reviews: {
          ...state.reviews,
          [action.payload.productId]: action.payload.reviews
        }
      };

    case FETCH_REVIEWS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case CREATE_REVIEW_REQUEST:
      return {
        ...state,
        creatingReview: true,
        createReviewError: null
      };

    case CREATE_REVIEW_SUCCESS:
      return {
        ...state,
        creatingReview: false,
        // Add new review to the appropriate product's reviews
        reviews: {
          ...state.reviews,
          [action.payload.productId]: [
            ...(state.reviews[action.payload.productId] || []),
            action.payload
          ]
        }
      };

    case CREATE_REVIEW_FAILURE:
      return {
        ...state,
        creatingReview: false,
        createReviewError: action.payload
      };

    default:
      return state;
  }
};

export default reviewReducer;
