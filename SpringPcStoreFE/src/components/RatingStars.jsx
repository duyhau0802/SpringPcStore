import React from 'react';

const RatingStars = ({ rating, reviewCount, size = 'small', showCount = true }) => {
  const maxRating = 5;
  const roundedRating = Math.round(rating);
  
  // Size classes
  const sizeClasses = {
    small: 'fs-6',
    medium: 'fs-5',
    large: 'fs-4'
  };
  
  const starSizeClass = sizeClasses[size] || sizeClasses.small;

  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= maxRating; i++) {
      if (i <= roundedRating) {
        // Filled star
        stars.push(
          <i 
            key={i} 
            className={`bi bi-star-fill text-warning ${starSizeClass} me-1`} 
          />
        );
      } else {
        // Empty star
        stars.push(
          <i 
            key={i} 
            className={`bi bi-star text-secondary ${starSizeClass} me-1`} 
          />
        );
      }
    }
    
    return stars;
  };

  return (
    <div className="d-flex align-items-center">
      <span className="me-2">
        {renderStars()}
      </span>
      {showCount && reviewCount > 0 && (
        <span className="text-muted small">
          ({reviewCount})
        </span>
      )}
      {showCount && (!reviewCount || reviewCount === 0) && (
        <span className="text-muted small">
          (No reviews)
        </span>
      )}
    </div>
  );
};

export default RatingStars;
