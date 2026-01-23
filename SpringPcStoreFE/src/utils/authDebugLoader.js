// Simple function to load auth debug utilities on demand
export const loadAuthDebug = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    import('./authDebug').then(() => {
      console.log('🔧 Auth debugging utilities loaded!');
      console.log('Available commands:');
      console.log('  - checkAuth() - Check authentication status');
      console.log('  - clearAuth() - Clear authentication data');
      console.log('  - decodeToken(token) - Decode JWT token');
      console.log('  - isTokenExpired(token) - Check if token is expired');
    }).catch(error => {
      console.error('Failed to load auth debug utilities:', error);
    });
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.loadAuthDebug = loadAuthDebug;
  console.log('💡 Run loadAuthDebug() to load authentication debugging utilities');
}
