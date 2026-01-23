import React from "react";
import { Link } from "react-router-dom";
import { formatPriceDisplay } from "../../utils/currencyUtils";
import RatingStars from "../RatingStars";

const CardProductGrid = (props) => {
  const product = props.data;
  return (
    <div className="card">
      <img src={product.img} className="card-img-top" alt="..." />
      {product.isNew && (
        <span className="badge bg-success position-absolute mt-2 ms-2">
          New
        </span>
      )}
      {product.isHot && (
        <span className="badge bg-danger position-absolute r-0 mt-2 me-2">
          Hot
        </span>
      )}
      {(product.discountPercentage > 0 || product.discountPrice > 0) && (
        <span
          className={`rounded position-absolute p-2 bg-warning  ms-2 small ${
            product.isNew ? "mt-5" : "mt-2"
          }`}
          style={{ display: 'none' }}
        >
          -
          {product.discountPercentage > 0
            ? product.discountPercentage + "%"
            : "$" + formatPriceDisplay(product.discountPrice)}
        </span>
      )}
      <div className="card-body">
        <h6 className="card-subtitle mb-2">
          <Link to={product.link} className="text-decoration-none">
            {product.name}
          </Link>
        </h6>
        <div className="my-2">
          <span className="fw-bold h5">${formatPriceDisplay(product.price)}</span>
          {product.originPrice > 0 && (
            <del className="small text-muted ms-2">${formatPriceDisplay(product.originPrice)}</del>
          )}
          <div className="mt-2">
            <RatingStars 
              rating={product.averageRating || product.star || 0} 
              reviewCount={product.reviewCount || 0}
              size="small"
            />
          </div>
        </div>
        <div className="btn-group  d-flex" role="group">
          <button
            type="button"
            className="btn btn-sm btn-primary"
            title="Add to cart"
          >
            <i className="bi bi-cart-plus" />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            title="Add to wishlist"
          >
            <i className="bi bi-heart-fill" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProductGrid;
