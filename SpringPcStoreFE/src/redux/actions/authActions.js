import { authAPI } from '../../services/api';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const LOGOUT = 'LOGOUT';
export const INIT_AUTH = 'INIT_AUTH';

export const login = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await authAPI.login(credentials);
    const { token, userId, username, email, roles } = response.data;
    
    // Create user object that matches what the frontend expects
    const user = {
      id: userId,
      username,
      email,
      roles
    };
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user, token }
    });
    
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Login failed';
    dispatch({
      type: LOGIN_FAILURE,
      payload: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};

export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const response = await authAPI.register(userData);
    // Backend returns a string message, not a user object
    const message = response.data;
    
    dispatch({
      type: REGISTER_SUCCESS,
      payload: { message }
    });
    
    return { success: true, message };
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Registration failed';
    dispatch({
      type: REGISTER_FAILURE,
      payload: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};

export const logout = () => (dispatch) => {
  authAPI.logout();
  dispatch({ type: LOGOUT });
};

export const initAuth = () => (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr && userStr !== 'undefined' && userStr !== 'null') {
      const parsedUser = JSON.parse(userStr);
      if (parsedUser && parsedUser !== null) {
        dispatch({
          type: INIT_AUTH,
          payload: {
            token,
            user: parsedUser,
            isAuthenticated: true
          }
        });
      } else {
        // Clear invalid user data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      // Clear any invalid data
      if (!token || token === 'undefined' || token === 'null') {
        localStorage.removeItem('token');
      }
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        localStorage.removeItem('user');
      }
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
    // Clear all corrupted data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
