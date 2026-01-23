// Utility functions for authentication debugging

/**
 * Check current authentication status from localStorage and Redux
 */
export const checkAuthStatus = () => {
  console.log('=== AUTHENTICATION STATUS ===');
  
  // Check localStorage
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  console.log('🔑 Token from localStorage:', {
    exists: !!token,
    length: token?.length || 0,
    preview: token ? `${token.substring(0, 20)}...` : 'null'
  });
  
  console.log('👤 User from localStorage:', {
    exists: !!userStr,
    data: userStr ? JSON.parse(userStr) : null
  });
  
  // Check Redux state (if available)
  try {
    const authState = window.__REDUX_STORE__?.getState()?.auth;
    if (authState) {
      console.log('🏪 Redux Auth State:', {
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        loading: authState.loading,
        error: authState.error
      });
    } else {
      console.log('🏪 Redux Auth State: Not available');
    }
  } catch (error) {
    console.log('🏪 Redux Auth State: Error accessing', error.message);
  }
  
  // Overall status
  const isAuth = !!(token && userStr);
  console.log('✅ Overall Authenticated:', isAuth);
  console.log('=== END AUTH STATUS ===');
  
  return {
    isAuthenticated: isAuth,
    token: token,
    user: userStr ? JSON.parse(userStr) : null
  };
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  console.log('🧹 Clearing authentication data...');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('✅ Authentication data cleared');
};

/**
 * Decode JWT token (basic)
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ Error decoding token:', error.message);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true; // If no exp, consider expired
    }
    
    const currentTime = Date.now() / 1000;
    const isExpired = decoded.exp < currentTime;
    
    console.log('⏰ Token Expiry Check:', {
      exp: decoded.exp,
      currentTime,
      isExpired,
      expiresAt: new Date(decoded.exp * 1000).toLocaleString()
    });
    
    return isExpired;
  } catch (error) {
    console.error('❌ Error checking token expiry:', error.message);
    return true;
  }
};

// Make available globally for console debugging (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.checkAuth = checkAuthStatus;
  window.clearAuth = clearAuth;
  window.decodeToken = decodeToken;
  window.isTokenExpired = isTokenExpired;
  
  console.log('🔧 Auth debugging functions available:');
  console.log('  - checkAuth() - Check authentication status');
  console.log('  - clearAuth() - Clear authentication data');
  console.log('  - decodeToken(token) - Decode JWT token');
  console.log('  - isTokenExpired(token) - Check if token is expired');
}
