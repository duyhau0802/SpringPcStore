import { Link } from "react-router-dom";

const TopMenu = () => {
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
                  <Link className="dropdown-item" to="/category?categoryId=1">
                    <i className="bi bi-laptop me-2"></i>Laptops & Computers
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category?categoryId=3">
                    <i className="bi bi-phone me-2"></i>Monitors
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category?categoryId=4">
                    <i className="bi bi-gpu-card me-2"></i>Graphics Cards
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category?categoryId=7">
                    <i className="bi bi-memory me-2"></i>Memory & Storage
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category?categoryId=8">
                    <i className="bi bi-motherboard me-2"></i>Motherboards
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category?categoryId=5">
                    <i className="bi bi-cpu me-2"></i>Processors
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" to="/category">
                    <i className="bi bi-box me-2"></i>All Components
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/category?minRating=4">
                <i className="bi bi-star-fill text-warning me-1"></i>
                Featured
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/category?sort=createdAt,desc">
                <i className="bi bi-fire text-danger me-1"></i>
                New Arrivals
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/category?categoryId=4">
                <i className="bi bi-shield-check text-success me-1"></i>
                Gaming
              </Link>
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
                <li>
                  <Link className="dropdown-item" to="/documentation">
                    <i className="bi bi-book me-2"></i>Documentation
                  </Link>
                </li>
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
