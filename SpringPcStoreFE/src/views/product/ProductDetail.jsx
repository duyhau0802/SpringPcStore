import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetail } from "../../redux/actions/productDetailActions";
import { fetchReviewsByProductId } from "../../redux/actions/reviewActions";
import { fetchProductsByCategory } from "../../redux/actions/productActions";
import { addToCart } from "../../redux/actions/cartActions";
import { lazy } from "react";
import { data } from "../../data";
import TECH_PLACEHOLDERS from "../../utils/imagePlaceholders";
import RatingStars from "../../components/RatingStars";
import { formatPrice, calculateOriginalPrice, calculateDiscountPrice, qualifiesForFreeShipping } from "../../utils/currencyUtils";

const CardFeaturedProduct = lazy(() =>
  import("../../components/card/CardFeaturedProduct")
);
const CardServices = lazy(() => import("../../components/card/CardServices"));
const Details = lazy(() => import("../../components/others/Details"));
const RatingsReviews = lazy(() =>
  import("../../components/others/RatingsReviews")
);
const QuestionAnswer = lazy(() =>
  import("../../components/others/QuestionAnswer")
);
const ShippingReturns = lazy(() =>
  import("../../components/others/ShippingReturns")
);
const SizeChart = lazy(() => import("../../components/others/SizeChart"));

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(state => state.productDetail);
  const { reviews } = useSelector(state => state.reviews);
  const { products } = useSelector(state => state.products);

  // State management
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // Get product ID from URL
  const getProductIdFromUrl = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }, []);

  // Handle quantity change
  const handleQuantityChange = useCallback((delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  }, []);

  // Handle image selection
  const handleImageSelect = useCallback((image) => {
    setSelectedImage(image);
  }, []);

  // Handle size selection
  const handleSizeSelect = useCallback((size) => {
    setSelectedSize(size);
  }, []);

  // Handle color selection
  const handleColorSelect = useCallback((color) => {
    setSelectedColor(color);
  }, []);

  // Handle add to cart
  const handleAddToCart = useCallback(async () => {
    console.log('ProductDetail - handleAddToCart called');
    console.log('Product:', product);
    console.log('Quantity:', quantity);
    
    if (!product) {
      console.error('No product available for adding to cart');
      return { success: false, error: 'No product available' };
    }
    
    const productPrice = product.price || 0;
    const productStoreId = product.storeId || 1;
    
    console.log('Adding to cart:', {
      productId: product.id,
      storeId: productStoreId,
      quantity: quantity,
      price: productPrice
    });
    
    setAddingToCart(true);
    try {
      const result = await dispatch(addToCart(
        product.id,
        productStoreId,
        quantity,
        productPrice
      ));
      
      console.log('Add to cart result:', result);
      
      if (result.success) {
        // Show success message
        alert('Product added to cart successfully!');
      } else {
        // Show error message
        if (result.error.includes('Please login')) {
          alert('Please login to add items to cart');
          // Optionally redirect to login
          window.location.href = '/login';
        } else {
          alert(`Failed to add to cart: ${result.error}`);
        }
      }
      return result;
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('An error occurred while adding to cart');
      return { success: false, error: error.message };
    } finally {
      setAddingToCart(false);
    }
  }, [product, quantity, dispatch]);

  // Handle buy now
  const handleBuyNow = useCallback(async () => {
    await handleAddToCart();
    // Navigate to checkout regardless of result (user can see error from handleAddToCart)
    window.location.href = '/checkout';
  }, [handleAddToCart]);

  // Get related products
  const getRelatedProducts = useCallback(() => {
    console.log('ProductDetail - getRelatedProducts:');
    console.log('  Current product:', product);
    console.log('  Available products:', products);
    
    if (!product || !products || !products.length) {
      console.log('  No product or products data');
      return [];
    }
    
    // Filter products from same category, exclude current product
    const relatedProducts = products
      .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 4) // Limit to 4 related products
      .map(p => formatProduct(p));
    
    console.log('  Related products:', relatedProducts);
    return relatedProducts;
  }, [product, products]);

  // Get product image
  const getProductImage = useCallback((product) => {
    const images = product.productImages || [];
    if (images.length > 0) {
      const mainImage = images.find(img => img.isMain) || images[0];
      return mainImage.imageUrl;
    }
    return TECH_PLACEHOLDERS.getPlaceholderByCategory(product.category?.name);
  }, []);

  // Format product data
  const formatProduct = useCallback((product) => {
    // Transform backend product data to match frontend component expectations
    const productPrice = product.price || 0;
    
    return {
      id: product.id,
      sku: `PC-${product.id}`,
      link: `/product/detail?id=${product.id}`,
      name: product.name,
      img: getProductImage(product),
      price: formatPrice(productPrice),
      originPrice: calculateOriginalPrice(productPrice, 10), // 10% original price markup
      discountPrice: calculateDiscountPrice(productPrice, 10), // 10% discount
      discountPercentage: 10,
      isNew: true,
      isHot: product.inventory?.quantity > 0 && product.inventory?.quantity < 5,
      star: Math.round(product.averageRating || 0), // Use backend rating
      isFreeShipping: qualifiesForFreeShipping(productPrice, 100), // Free shipping for orders over $100
      description: product.description || "High-quality computer product for your needs",
      category: product.category?.name || "Computer Components",
      brand: product.brand?.name || "Tech Brand",
      stock: product.inventory?.quantity || 0,
      reviewCount: product.reviewCount || 0,
      averageRating: product.averageRating || 0
    };
  }, [getProductImage]);

  // Effects
  useEffect(() => {
    const productId = getProductIdFromUrl();
    if (productId) {
      dispatch(fetchProductDetail(productId));
      dispatch(fetchReviewsByProductId(productId));
    }
  }, [dispatch, getProductIdFromUrl]);

  useEffect(() => {
    // Fetch related products when product data is loaded
    if (product && product.categoryId) {
      dispatch(fetchProductsByCategory(product.categoryId));
    }
  }, [dispatch, product]);

  // Render functions
  const renderLoading = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading product details...</p>
    </div>
  );

  const renderError = () => (
    <div className="text-center py-5">
      <div className="alert alert-danger">
        <h4>Error loading product</h4>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    </div>
  );

  const renderProductImages = (product) => {
    const images = product.productImages || [];
    const mainImage = selectedImage || 
                     (images.length > 0 ? images.find(img => img.isMain) || images[0] : null);
    
    return (
      <div className="col-md-5 text-center">
        {mainImage ? (
          <img
            src={mainImage.imageUrl}
            className="img-fluid mb-3"
            alt={product.name}
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        ) : (
          <img
            src={TECH_PLACEHOLDERS.getPlaceholderByCategory(product.category?.name)}
            className="img-fluid mb-3"
            alt={product.name}
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        )}
        
        <div className="d-flex justify-content-center flex-wrap">
          {images.map((image, index) => (
            <img
              key={image.id || index}
              src={image.imageUrl}
              className={`border me-2 mb-2 ${selectedImage?.imageUrl === image.imageUrl ? 'border-primary' : 'border-secondary'}`}
              width="75"
              height="75"
              style={{ objectFit: 'cover', cursor: 'pointer' }}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => handleImageSelect(image)}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderProductInfo = (product) => {
    const isInStock = product.inventory?.quantity > 0;
    const productPrice = product.price || 0;
    const originalPrice = calculateOriginalPrice(productPrice, 10);
    const discountPrice = calculateDiscountPrice(productPrice, 10);
    const discountAmount = originalPrice - discountPrice;
    
    return (
      <div className="col-md-7">
        <h1 className="h5 d-inline me-2">{product.name}</h1>
        {product.status === 'ACTIVE' && <span className="badge bg-success me-2">New</span>}
        {product.inventory?.quantity > 0 && product.inventory?.quantity < 5 && (
          <span className="badge bg-danger me-2">Hot</span>
        )}
        
        <div className="mb-3">
          <RatingStars 
            rating={product.averageRating || 0} 
            reviewCount={product.reviewCount || 0}
            size="small"
          />
        </div>
        
        <dl className="row small mb-3">
          <dt className="col-sm-3">Availability</dt>
          <dd className="col-sm-9">
            {isInStock ? (
              <span className="text-success">In stock ({product.inventory?.quantity} available)</span>
            ) : (
              <span className="text-danger">Out of stock</span>
            )}
          </dd>
          
          <dt className="col-sm-3">Sold by</dt>
          <dd className="col-sm-9">{product.store?.name || 'Tech Store'}</dd>
          
          <dt className="col-sm-3">Category</dt>
          <dd className="col-sm-9">{product.category?.name || 'Computer Components'}</dd>
          
          <dt className="col-sm-3">Brand</dt>
          <dd className="col-sm-9">{product.brand?.name || 'Tech Brand'}</dd>
        </dl>

        <div className="mb-3">
          <span className="fw-bold h5 me-2">{formatPrice(productPrice)}</span>
          <del className="small text-muted me-2">{formatPrice(originalPrice)}</del>
          <span className="rounded p-1 bg-warning me-2 small">
            -{formatPrice(discountAmount)}
          </span>
        </div>
        
        <div className="mb-3">
          <div className="d-inline float-start me-2">
            <div className="input-group input-group-sm mw-140">
              <button
                className="btn btn-primary text-white"
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <i className="bi bi-dash-lg"></i>
              </button>
              <input
                type="text"
                className="form-control text-center"
                value={quantity}
                readOnly
              />
              <button
                className="btn btn-primary text-white"
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={!isInStock}
              >
                <i className="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-primary me-2"
            title="Add to cart"
            onClick={handleAddToCart}
            disabled={!isInStock || addingToCart}
          >
            {addingToCart ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Adding...
              </>
            ) : (
              <>
                <i className="bi bi-cart-plus me-1"></i>Add to cart
              </>
            )}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-warning me-2"
            title="Buy now"
            onClick={handleBuyNow}
            disabled={!isInStock || addingToCart}
          >
            {addingToCart ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              <>
                <i className="bi bi-cart3 me-1"></i>Buy now
              </>
            )}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            title="Add to wishlist"
          >
            <i className="bi bi-heart-fill"></i>
          </button>
        </div>
        
        <div>
          <p className="fw-bold mb-2 small">Product Highlights</p>
          <ul className="small">
            {product.productSpecs?.slice(0, 3).map((spec, index) => (
              <li key={spec.id || index}>
                <strong>{spec.specKey}:</strong> {spec.specValue}
              </li>
            ))}
            <li>High-quality computer product for your needs</li>
          </ul>
        </div>
      </div>
    );
  };

  // Main render
  console.log('ProductDetail render:', { loading, error, product, reviews });

  // Add error boundary for component rendering
  try {
    if (loading) {
      return renderLoading();
    }

    if (error) {
      console.error('ProductDetail error:', error);
      return renderError();
    }

    if (!product) {
      console.warn('ProductDetail: No product data');
      return (
        <div className="text-center py-5">
          <h4>Product not found</h4>
          <button className="btn btn-primary" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>
      );
    }

    // Additional validation
    if (!product.id) {
      console.error('ProductDetail: Invalid product data - missing ID');
      return (
        <div className="text-center py-5">
          <h4>Invalid product data</h4>
          <button className="btn btn-primary" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>
      );
    }

  } catch (renderError) {
    console.error('ProductDetail render error:', renderError);
    return (
      <div className="text-center py-5">
        <div className="alert alert-danger">
          <h4>Rendering Error</h4>
          <p>An error occurred while rendering the product details.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Safe render functions with error handling
  const safeRenderProductImages = (product) => {
    try {
      return renderProductImages(product);
    } catch (error) {
      console.error('Error rendering product images:', error);
      return (
        <div className="col-md-5 text-center">
          <div className="alert alert-warning">
            Unable to load product images
          </div>
        </div>
      );
    }
  };

  const safeRenderProductInfo = (product) => {
    try {
      return renderProductInfo(product);
    } catch (error) {
      console.error('Error rendering product info:', error);
      return (
        <div className="col-md-7">
          <div className="alert alert-warning">
            Unable to load product information
          </div>
        </div>
      );
    }
  };

  const safeGetRelatedProducts = () => {
    try {
      return getRelatedProducts();
    } catch (error) {
      console.error('Error getting related products:', error);
      return [];
    }
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-md-8">
          <div className="row mb-3">
            {safeRenderProductImages(product)}
            {safeRenderProductInfo(product)}
          </div>
          <div className="row">
            <div className="col-md-12">
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <a
                    className="nav-link active"
                    id="nav-details-tab"
                    data-bs-toggle="tab"
                    href="#nav-details"
                    role="tab"
                    aria-controls="nav-details"
                    aria-selected="true"
                  >
                    Details
                  </a>
                  <a
                    className="nav-link"
                    id="nav-randr-tab"
                    data-bs-toggle="tab"
                    href="#nav-randr"
                    role="tab"
                    aria-controls="nav-randr"
                    aria-selected="false"
                  >
                    Ratings & Reviews
                  </a>
                  <a
                    className="nav-link"
                    id="nav-faq-tab"
                    data-bs-toggle="tab"
                    href="#nav-faq"
                    role="tab"
                    aria-controls="nav-faq"
                    aria-selected="false"
                  >
                    Questions and Answers
                  </a>
                  <a
                    className="nav-link"
                    id="nav-ship-returns-tab"
                    data-bs-toggle="tab"
                    href="#nav-ship-returns"
                    role="tab"
                    aria-controls="nav-ship-returns"
                    aria-selected="false"
                  >
                    Shipping & Returns
                  </a>
                </div>
              </nav>
              <div className="tab-content p-3 small" id="nav-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="nav-details"
                  role="tabpanel"
                  aria-labelledby="nav-details-tab"
                >
                  <Details />
                </div>
                <div
                  className="tab-pane fade"
                  id="nav-randr"
                  role="tabpanel"
                  aria-labelledby="nav-randr-tab"
                >
                  <RatingsReviews 
                    product={product}
                    reviews={(reviews && reviews.reviews && reviews.reviews[product.id]) || []}
                  />
                </div>
                <div
                  className="tab-pane fade"
                  id="nav-faq"
                  role="tabpanel"
                  aria-labelledby="nav-faq-tab"
                >
                  <dl>
                    {Array.from({ length: 5 }, (_, key) => (
                      <QuestionAnswer key={key} />
                    ))}
                  </dl>
                </div>
                <div
                  className="tab-pane fade"
                  id="nav-ship-returns"
                  role="tabpanel"
                  aria-labelledby="nav-ship-returns-tab"
                >
                  <ShippingReturns />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <CardFeaturedProduct 
            data={safeGetRelatedProducts()} 
            title="Related Products"
          />
          <CardServices />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
