import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const FilterPrice = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse current URL to set price range
    const urlParams = new URLSearchParams(location.search);
    const minPrice = urlParams.get('minPrice');
    const maxPrice = urlParams.get('maxPrice');
    
    if (minPrice || maxPrice) {
      setPriceRange({
        min: minPrice || '',
        max: maxPrice || ''
      });
    }
  }, [location.search]);

  const updateURL = (minPrice, maxPrice) => {
    const urlParams = new URLSearchParams(location.search);
    
    if (minPrice !== null) {
      urlParams.set('minPrice', minPrice);
    } else {
      urlParams.delete('minPrice');
    }
    
    if (maxPrice !== null) {
      urlParams.set('maxPrice', maxPrice);
    } else {
      urlParams.delete('maxPrice');
    }
    
    navigate(`${location.pathname}?${urlParams.toString()}`);
  };

  const handlePriceChange = (field, value) => {
    const newRange = { ...priceRange, [field]: value };
    setPriceRange(newRange);
    
    const minPrice = newRange.min ? parseFloat(newRange.min) : null;
    const maxPrice = newRange.max ? parseFloat(newRange.max) : null;
    
    // Update URL
    updateURL(minPrice, maxPrice);
    
    // Trigger filter change
    if (onFilterChange) {
      onFilterChange({
        minPrice,
        maxPrice
      });
    }
  };

  const handleQuickSelect = (min, max) => {
    setPriceRange({ min: min.toString(), max: max.toString() });
    
    // Update URL
    updateURL(min, max);
    
    // Trigger filter change
    if (onFilterChange) {
      onFilterChange({
        minPrice: min,
        maxPrice: max
      });
    }
  };

  const clearPriceFilter = () => {
    setPriceRange({ min: '', max: '' });
    
    // Update URL
    updateURL(null, null);
    
    // Trigger filter change
    if (onFilterChange) {
      onFilterChange({
        minPrice: null,
        maxPrice: null
      });
    }
  };

  return (
    <div className="card mb-3">
      <div
        className="card-header fw-bold text-uppercase accordion-icon-button"
        data-bs-toggle="collapse"
        data-bs-target="#filterPrice"
        aria-expanded="true"
        aria-controls="filterPrice"
      >
        Price
      </div>
      <ul className="list-group list-group-flush show" id="filterPrice">
        <li className="list-group-item">
          <div className="mb-3">
            <label className="form-label small">Min Price ($)</label>
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="0"
              value={priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label small">Max Price ($)</label>
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="10000"
              value={priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
            />
          </div>
          <button
            className="btn btn-sm btn-outline-secondary w-100"
            onClick={clearPriceFilter}
          >
            Clear
          </button>
        </li>
        <li className="list-group-item">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="priceRange"
              id="price1"
              onChange={() => handleQuickSelect(0, 500)}
            />
            <label className="form-check-label" htmlFor="price1">
              Under $500
            </label>
          </div>
        </li>
        <li className="list-group-item">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="priceRange"
              id="price2"
              onChange={() => handleQuickSelect(500, 1000)}
            />
            <label className="form-check-label" htmlFor="price2">
              $500 - $1,000
            </label>
          </div>
        </li>
        <li className="list-group-item">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="priceRange"
              id="price3"
              onChange={() => handleQuickSelect(1000, 2000)}
            />
            <label className="form-check-label" htmlFor="price3">
              $1,000 - $2,000
            </label>
          </div>
        </li>
        <li className="list-group-item">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="priceRange"
              id="price4"
              onChange={() => handleQuickSelect(2000, 5000)}
            />
            <label className="form-check-label" htmlFor="price4">
              $2,000 - $5,000
            </label>
          </div>
        </li>
        <li className="list-group-item">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="priceRange"
              id="price5"
              onChange={() => handleQuickSelect(5000, 999999)}
            />
            <label className="form-check-label" htmlFor="price5">
              Over $5,000
            </label>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default FilterPrice;
