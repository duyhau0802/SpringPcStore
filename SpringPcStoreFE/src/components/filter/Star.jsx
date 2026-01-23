import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const FilterStar = ({ onFilterChange }) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse current URL to set selected rating
    const urlParams = new URLSearchParams(location.search);
    const minRating = urlParams.get('minRating');
    if (minRating) {
      setSelectedRating(parseInt(minRating));
    }
  }, [location.search]);

  const handleRatingChange = (rating) => {
    const newRating = rating === selectedRating ? null : rating;
    setSelectedRating(newRating);
    
    // Update URL
    const urlParams = new URLSearchParams(location.search);
    if (newRating) {
      urlParams.set('minRating', newRating);
    } else {
      urlParams.delete('minRating');
    }
    
    navigate(`${location.pathname}?${urlParams.toString()}`);
    
    // Trigger filter change
    if (onFilterChange) {
      onFilterChange({ 
        minRating: newRating
      });
    }
  };

  const renderStars = (filledStars) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i 
          key={i} 
          className={`bi bi-star${i <= filledStars ? '-fill text-warning' : '-fill text-secondary'} me-1 mb-2`} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="card mb-3">
      <div
        className="card-header fw-bold text-uppercase accordion-icon-button"
        data-bs-toggle="collapse"
        data-bs-target="#filterStar"
        aria-expanded="true"
        aria-controls="filterStar"
      >
        Customer Rating
      </div>
      <div className="card-body show" id="filterStar">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="ratingFilter"
            id="rating5"
            checked={selectedRating === 5}
            onChange={() => handleRatingChange(5)}
          />
          <label
            className="form-check-label"
            htmlFor="rating5"
          >
            {renderStars(5)}
            <span className="ms-2">5 Stars</span>
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="ratingFilter"
            id="rating4"
            checked={selectedRating === 4}
            onChange={() => handleRatingChange(4)}
          />
          <label
            className="form-check-label"
            htmlFor="rating4"
          >
            {renderStars(4)}
            <span className="ms-2">4 Stars & Up</span>
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="ratingFilter"
            id="rating3"
            checked={selectedRating === 3}
            onChange={() => handleRatingChange(3)}
          />
          <label
            className="form-check-label"
            htmlFor="rating3"
          >
            {renderStars(3)}
            <span className="ms-2">3 Stars & Up</span>
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="ratingFilter"
            id="rating2"
            checked={selectedRating === 2}
            onChange={() => handleRatingChange(2)}
          />
          <label
            className="form-check-label"
            htmlFor="rating2"
          >
            {renderStars(2)}
            <span className="ms-2">2 Stars & Up</span>
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="ratingFilter"
            id="rating1"
            checked={selectedRating === 1}
            onChange={() => handleRatingChange(1)}
          />
          <label
            className="form-check-label"
            htmlFor="rating1"
          >
            {renderStars(1)}
            <span className="ms-2">1 Star & Up</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterStar;
