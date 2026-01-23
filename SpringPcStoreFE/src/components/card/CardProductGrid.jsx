import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatPriceDisplay } from "../../utils/currencyUtils";
import { addToCart } from "../../redux/actions/cartActions";
import RatingStars from "../RatingStars";

const CardProductGrid = (props) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const product = props.data;
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    if (product.stock <= 0) {
      alert('This product is out of stock');
      return;
    }

    setAddingToCart(true);
    try {
      const result = await dispatch(addToCart(
        product.id,
        1, // Default store ID
        1, // Default quantity
        product.price
      ));
      
      if (result.success) {
        alert('Product added to cart successfully!');
      } else {
        alert(`Failed to add to cart: ${result.error}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('An error occurred while adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

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
        <div className="btn-group d-flex" role="group">
          <button
            type="button"
            className={`btn btn-sm ${addingToCart ? 'btn-secondary' : 'btn-primary'}`}
            title="Add to cart"
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock <= 0}
          >
            {addingToCart ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Adding...
              </>
            ) : (
              <i className="bi bi-cart-plus" />
            )}
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
