import React from 'react';
import RatingStars from '../RatingStars';

const RatingsReviews = ({ product, reviews = [] }) => {
  // If no product data provided, show fallback
  if (!product) {
    return (
      <div className="border-bottom mb-3">
        <div className="mb-2">
          <span>
            <i className="bi bi-star-fill text-warning me-1" />
            <i className="bi bi-star-fill text-warning me-1" />
            <i className="bi bi-star-fill text-warning me-1" />
            <i className="bi bi-star-fill text-warning me-1" />
            <i className="bi bi-star-fill text-secondary me-1" />
          </span>
          <span className="text-muted">
            <i className="bi bi-patch-check-fill text-success me-1" />
            Certified Buyer | Reviewed on{" "}
            <i className="fw-bold">15 October 2020</i>
          </span>
        </div>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </p>
        <div className="mb-2">
          <button className="btn btn-sm btn-outline-success me-2">
            <i className="bi bi-hand-thumbs-up-fill"></i> 10
          </button>
          <button className="btn btn-sm btn-outline-danger me-2">
            <i className="bi bi-hand-thumbs-down-fill"></i> 5
          </button>
          <button type="button" className="btn btn-sm btn-outline-secondary">
            Report abuse
          </button>
        </div>
      </div>
    );
  }

  // Display actual reviews from database
  if (reviews.length === 0) {
    return (
      <div className="text-center py-4">
        <h5>No reviews yet</h5>
        <p className="text-muted">Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Rating Summary */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Customer Reviews</h5>
          <div className="d-flex align-items-center mb-3">
            <div className="me-3">
              <h2 className="mb-0">{product.averageRating?.toFixed(1) || '0.0'}</h2>
              <RatingStars 
                rating={product.averageRating || 0} 
                reviewCount={product.reviewCount || 0}
                size="medium"
              />
              <small className="text-muted">{product.reviewCount || 0} reviews</small>
            </div>
            <div className="flex-grow-1">
              {/* Rating distribution */}
              {[5, 4, 3, 2, 1].map(stars => {
                const count = reviews.filter(r => Math.round(r.rating) === stars).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="d-flex align-items-center mb-1">
                    <span className="me-2" style={{ minWidth: '60px' }}>{stars} stars</span>
                    <div className="progress flex-grow-1 me-2" style={{ height: '20px' }}>
                      <div 
                        className="progress-bar bg-warning" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span style={{ minWidth: '40px' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      {reviews.map((review, index) => (
        <div key={review.id || index} className="border-bottom mb-3">
          <div className="mb-2">
            <RatingStars rating={review.rating || 0} size="small" />
            <span className="text-muted ms-2">
              <i className="bi bi-patch-check-fill text-success me-1" />
              Certified Buyer | Reviewed on{" "}
              <i className="fw-bold">
                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown date'}
              </i>
            </span>
          </div>
          <p>{review.comment || 'No comment provided'}</p>
          <div className="mb-2">
            <button className="btn btn-sm btn-outline-success me-2">
              <i className="bi bi-hand-thumbs-up-fill"></i> Helpful
            </button>
            <button className="btn btn-sm btn-outline-danger me-2">
              <i className="bi bi-hand-thumbs-down-fill"></i> Not Helpful
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary">
              Report abuse
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RatingsReviews;
