export const resetAuthData = () => {
  console.log('Resetting all auth data...');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('cfstate');
  console.log('Auth data cleared. Please refresh the page.');
};

// Run this in browser console to reset: resetAuthData()
window.resetAuthData = resetAuthData;
