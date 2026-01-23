export const clearCorruptedStorage = () => {
  try {
    // Clear potentially corrupted auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cfstate');
    console.log('Cleared corrupted localStorage data');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Auto-clear on load if there's corrupted data
export const validateStorage = () => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      JSON.parse(user); // This will throw if corrupted
    }
  } catch (error) {
    console.error('Corrupted user data detected, clearing...');
    clearCorruptedStorage();
    return false;
  }
  return true;
};
