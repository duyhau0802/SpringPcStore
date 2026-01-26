import { Link, useLocation, useNavigate } from "react-router-dom";

const TopMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    const url = categoryId ? `/category?categoryId=${categoryId}` : '/category';
    
    // If already on category page, navigate without reload
    if (location.pathname === '/category') {
      navigate(url, { replace: true });
      // Trigger a custom event to notify ProductList to update
      window.dispatchEvent(new CustomEvent('categoryFilterChanged', { 
        detail: { categoryId } 
      }));
    } else {
      navigate(url);
    }
  };

  const handleFeaturedClick = () => {
    const url = '/category?minRating=4';
    
    if (location.pathname === '/category') {
      navigate(url, { replace: true });
      window.dispatchEvent(new CustomEvent('filterChanged', { 
        detail: { minRating: 4 } 
      }));
    } else {
      navigate(url);
    }
  };

  const handleNewArrivalsClick = () => {
    const url = '/category?sort=createdAt,desc';
    
    if (location.pathname === '/category') {
      navigate(url, { replace: true });
      window.dispatchEvent(new CustomEvent('filterChanged', { 
        detail: { sort: 'createdAt,desc' } 
      }));
    } else {
      navigate(url);
    }
  };

  const handleGamingClick = () => {
    const url = '/category?categoryId=1'; // Point to Laptop category for gaming laptops
    
    if (location.pathname === '/category') {
      navigate(url, { replace: true });
      window.dispatchEvent(new CustomEvent('categoryFilterChanged', { 
        detail: { categoryId: 1 } 
      }));
    } else {
      navigate(url);
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-0">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-cpu-fill me-2"></i>Tech Store
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <button
                className="btn nav-link dropdown-toggle fw-bold"
                id="navbarDropdown"
                data-toggle="dropdown"
                aria-expanded="false"
                data-bs-toggle="dropdown"
              >
                Categories
              </button>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <button className="dropdown-item" onClick={() => handleCategoryClick(1)}>
                    <i className="bi bi-laptop me-2"></i>Laptop
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleCategoryClick(2)}>
                    <i className="bi bi-headphones me-2"></i>Headset
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleCategoryClick(3)}>
                    <i className="bi bi-phone me-2"></i>Phone
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleCategoryClick(4)}>
                    <i className="bi bi-tv me-2"></i>TV
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleCategoryClick(5)}>
                    <i className="bi bi-display me-2"></i>Display
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleCategoryClick(6)}>
                    <i className="bi bi-hdd me-2"></i>HDD
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleCategoryClick(7)}>
                    <i className="bi bi-upc me-2"></i>UPC Scan
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleCategoryClick(8)}>
                    <i className="bi bi-tools me-2"></i>Tools
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleCategoryClick(null)}>
                    <i className="bi bi-grid me-2"></i>All Categories
                  </button>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleFeaturedClick}>
                <i className="bi bi-star-fill text-warning me-1"></i>
                Featured
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleNewArrivalsClick}>
                <i className="bi bi-fire text-danger me-1"></i>
                New Arrivals
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleGamingClick}>
                <i className="bi bi-shield-check text-success me-1"></i>
                Gaming
              </button>
            </li>
            <li className="nav-item dropdown">
              <button
                className="btn nav-link dropdown-toggle"
                id="supportDropdown"
                data-toggle="dropdown"
                aria-expanded="false"
                data-bs-toggle="dropdown"
              >
                Support
              </button>
              <ul className="dropdown-menu" aria-labelledby="supportDropdown">
                {/* <li>
                  <Link className="dropdown-item" to="/documentation">
                    <i className="bi bi-book me-2"></i>Documentation
                  </Link>
                </li> */}
                <li>
                  <Link className="dropdown-item" to="/support">
                    <i className="bi bi-headset me-2"></i>Customer Support
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/contact-us">
                    <i className="bi bi-envelope me-2"></i>Contact Us
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;
