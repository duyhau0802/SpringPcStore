import { lazy, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../redux/actions/authActions";
import { fetchCart } from "../redux/actions/cartActions";
import ThemeToggle from "./ThemeToggle";
const Search = lazy(() => import("./Search"));

const Header = ({ auth, logout, cart, fetchCart }) => {
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  useEffect(() => {
    // Fetch cart data when user is authenticated
    if (auth.isAuthenticated && auth.user) {
      fetchCart().catch(error => {
        console.error('Failed to fetch cart:', error);
        // Don't show error to user, just log it
      });
    }
  }, [auth.isAuthenticated, auth.user, fetchCart]);

  return (
    <header className="p-3 border-bottom bg-light">
      <div className="container-fluid">
        <div className="row g-3">
          <div className="col-md-3 text-center">
            <Link to="/" className="text-decoration-none">
              <div className="d-flex align-items-center justify-content-center">
                <i className="bi bi-cpu-fill text-primary me-2" style={{fontSize: '1.5rem'}}></i>
                <div>
                  <div className="fw-bold">Tech Store</div>
                  <small className="text-muted">Computer Components</small>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-5">
            <Search />
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center justify-content-end">
              <ThemeToggle />
              <div className="position-relative me-3">
                <Link to="/cart" className="btn btn-outline-primary position-relative">
                  <i className="bi bi-cart3"></i>
                  <span className="ms-1 d-none d-md-inline">Cart</span>
                  {cart && cart.totalItems > 0 && (
                    <div className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-circle">
                      {cart.totalItems > 99 ? '99+' : cart.totalItems}
                    </div>
                  )}
                </Link>
              </div>
              
              <div className="position-relative me-3">
                <Link to="/account/wishlist" className="btn btn-outline-danger">
                  <i className="bi bi-heart"></i>
                  <span className="ms-1 d-none d-md-inline">Wishlist</span>
                </Link>
              </div>
              
              {auth.isAuthenticated ? (
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-circle border me-2"
                    data-toggle="dropdown"
                    aria-expanded="false"
                    aria-label="Profile"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person-fill"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/account/profile">
                        <i className="bi bi-person-square me-2"></i> 
                        {auth.user?.fullName || 'My Profile'}
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/account/orders">
                        <i className="bi bi-box-seam me-2 text-primary"></i> 
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/account/wishlist">
                        <i className="bi bi-heart-fill me-2 text-danger"></i> 
                        Wishlist
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/star/zone">
                        <i className="bi bi-star-fill me-2 text-warning"></i> 
                        Rewards
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/account/notification">
                        <i className="bi bi-bell-fill me-2 text-primary"></i> 
                        Notifications
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/support">
                        <i className="bi bi-headset me-2 text-success"></i> 
                        Support
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-door-closed-fill me-2"></i> 
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <Link to="/account/signin" className="btn btn-outline-primary btn-sm me-2">
                    <i className="bi bi-box-arrow-in-right me-1"></i>Sign In
                  </Link>
                  <Link to="/account/signup" className="btn btn-primary btn-sm">
                    <i className="bi bi-person-plus me-1"></i>Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  cart: state.cart,
});

export default connect(mapStateToProps, { logout, fetchCart })(Header);
