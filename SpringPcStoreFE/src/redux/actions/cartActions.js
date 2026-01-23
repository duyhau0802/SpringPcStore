import { cartAPI } from '../../services/cartAPI';

export const FETCH_CART_REQUEST = 'FETCH_CART_REQUEST';
export const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS';
export const FETCH_CART_FAILURE = 'FETCH_CART_FAILURE';

export const ADD_TO_CART_REQUEST = 'ADD_TO_CART_REQUEST';
export const ADD_TO_CART_SUCCESS = 'ADD_TO_CART_SUCCESS';
export const ADD_TO_CART_FAILURE = 'ADD_TO_CART_FAILURE';

export const UPDATE_CART_ITEM_REQUEST = 'UPDATE_CART_ITEM_REQUEST';
export const UPDATE_CART_ITEM_SUCCESS = 'UPDATE_CART_ITEM_SUCCESS';
export const UPDATE_CART_ITEM_FAILURE = 'UPDATE_CART_ITEM_FAILURE';

export const REMOVE_FROM_CART_REQUEST = 'REMOVE_FROM_CART_REQUEST';
export const REMOVE_FROM_CART_SUCCESS = 'REMOVE_FROM_CART_SUCCESS';
export const REMOVE_FROM_CART_FAILURE = 'REMOVE_FROM_CART_FAILURE';

export const CLEAR_CART_REQUEST = 'CLEAR_CART_REQUEST';
export const CLEAR_CART_SUCCESS = 'CLEAR_CART_SUCCESS';
export const CLEAR_CART_FAILURE = 'CLEAR_CART_FAILURE';

export const RESET_CART_STATE = 'RESET_CART_STATE';

// Fetch user's cart
export const fetchCart = () => async (dispatch) => {
  dispatch({ type: FETCH_CART_REQUEST });
  try {
    const response = await cartAPI.getCart();
    const cart = response.data;
    
    dispatch({
      type: FETCH_CART_SUCCESS,
      payload: cart
    });
    
    return { success: true, cart };
  } catch (error) {
    let errorMessage = 'Failed to fetch cart';
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      errorMessage = 'Please login to view your cart';
    } else if (error.response?.status === 403) {
      errorMessage = 'Access denied';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    dispatch({
      type: FETCH_CART_FAILURE,
      payload: errorMessage
    });
    
    return { success: false, error: errorMessage };
  }
};

// Add item to cart
export const addToCart = (productId, storeId, quantity, price) => async (dispatch) => {
  console.log('cartActions - addToCart called with:', { productId, storeId, quantity, price });
  
  dispatch({ type: ADD_TO_CART_REQUEST });
  try {
    const cartItemData = cartAPI.formatCartItemRequest(productId, storeId, quantity, price);
    console.log('cartActions - cartItemData:', cartItemData);
    
    const response = await cartAPI.addItemToCart(cartItemData);
    console.log('cartActions - API response:', response);
    
    const cart = response.data;
    
    dispatch({
      type: ADD_TO_CART_SUCCESS,
      payload: cart
    });
    
    return { success: true, cart };
  } catch (error) {
    console.log('cartActions - Error details:', error);
    console.log('cartActions - Error response:', error.response);
    console.log('cartActions - Error status:', error.response?.status);
    
    let errorMessage = 'Failed to add item to cart';
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      errorMessage = 'Please login to add items to cart';
    } else if (error.response?.status === 403) {
      errorMessage = 'Access denied';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.log('cartActions - Final error message:', errorMessage);
    
    dispatch({
      type: ADD_TO_CART_FAILURE,
      payload: errorMessage
    });
    
    return { success: false, error: errorMessage };
  }
};

// Update cart item quantity
export const updateCartItemQuantity = (cartItemId, quantity) => async (dispatch) => {
  dispatch({ type: UPDATE_CART_ITEM_REQUEST });
  try {
    const response = await cartAPI.updateCartItemQuantity(cartItemId, quantity);
    const cart = response.data;
    
    dispatch({
      type: UPDATE_CART_ITEM_SUCCESS,
      payload: cart
    });
    
    return { success: true, cart };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update cart item';
    dispatch({
      type: UPDATE_CART_ITEM_FAILURE,
      payload: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};

// Remove item from cart
export const removeFromCart = (cartItemId) => async (dispatch) => {
  dispatch({ type: REMOVE_FROM_CART_REQUEST });
  try {
    const response = await cartAPI.removeItemFromCart(cartItemId);
    const cart = response.data;
    
    dispatch({
      type: REMOVE_FROM_CART_SUCCESS,
      payload: cart
    });
    
    return { success: true, cart };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to remove item from cart';
    dispatch({
      type: REMOVE_FROM_CART_FAILURE,
      payload: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};

// Clear entire cart
export const clearCart = () => async (dispatch) => {
  dispatch({ type: CLEAR_CART_REQUEST });
  try {
    await cartAPI.clearCart();
    
    dispatch({
      type: CLEAR_CART_SUCCESS
    });
    
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to clear cart';
    dispatch({
      type: CLEAR_CART_FAILURE,
      payload: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};

// Reset cart state (for logout)
export const resetCartState = () => (dispatch) => {
  dispatch({ type: RESET_CART_STATE });
};
