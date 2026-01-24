// Quick auth check without importing debug utilities
console.log('=== QUICK AUTH CHECK ===');
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

console.log('Token exists:', !!token);
console.log('Token length:', token?.length || 0);
console.log('Token preview:', token ? `${token.substring(0, 30)}...` : 'null');

console.log('User exists:', !!user);
console.log('User data:', user ? JSON.parse(user) : null);

// Check if token is valid format
if (token) {
  const parts = token.split('.');
  console.log('Token parts count:', parts.length);
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(atob(parts[1]));
      console.log('Token payload:', payload);
      console.log('Token expires at:', new Date(payload.exp * 1000).toLocaleString());
      console.log('Token expired:', payload.exp < Date.now() / 1000);
    } catch (e) {
      console.log('Token decode error:', e.message);
    }
  }
}

console.log('=== END QUICK CHECK ===');
