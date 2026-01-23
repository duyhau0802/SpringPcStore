import {
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  REMOVE_FROM_CART_REQUEST,
  REMOVE_FROM_CART_SUCCESS,
  REMOVE_FROM_CART_FAILURE,
  CLEAR_CART_REQUEST,
  CLEAR_CART_SUCCESS,
  CLEAR_CART_FAILURE,
  RESET_CART_STATE
} from '../actions/cartActions';

const initialState = {
  cart: null,
  cartItems: [],
  loading: false,
  error: null,
  totalPrice: 0,
  totalItems: 0
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CART_REQUEST:
    case ADD_TO_CART_REQUEST:
    case UPDATE_CART_ITEM_REQUEST:
    case REMOVE_FROM_CART_REQUEST:
    case CLEAR_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_CART_SUCCESS:
    case ADD_TO_CART_SUCCESS:
    case UPDATE_CART_ITEM_SUCCESS:
    case REMOVE_FROM_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: action.payload,
        cartItems: action.payload.cartItems || [],
        totalPrice: action.payload.totalPrice || 0,
        totalItems: action.payload.totalItems || 0,
        error: null
      };

    case CLEAR_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: null,
        cartItems: [],
        totalPrice: 0,
        totalItems: 0,
        error: null
      };

    case FETCH_CART_FAILURE:
    case ADD_TO_CART_FAILURE:
    case UPDATE_CART_ITEM_FAILURE:
    case REMOVE_FROM_CART_FAILURE:
    case CLEAR_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case RESET_CART_STATE:
      return {
        ...initialState
      };

    default:
      return state;
  }
};

export default cartReducer;
