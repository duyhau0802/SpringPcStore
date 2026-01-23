import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchProductDetail } from "../../redux/actions/productDetailActions";
import { fetchReviewsByProductId } from "../../redux/actions/reviewActions";
import { fetchProductsByCategory } from "../../redux/actions/productActions";
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

class ProductDetail extends Component {
  state = {
    quantity: 1,
    selectedImage: null,
    selectedSize: null,
    selectedColor: null
  };

  componentDidMount() {
    const productId = this.getProductIdFromUrl();
    if (productId) {
      this.props.fetchProductDetail(productId);
      this.props.fetchReviewsByProductId(productId);
    }
  }

  componentDidUpdate(prevProps) {
    // Fetch related products when product data is loaded
    if (this.props.productDetail.product && !prevProps.productDetail.product) {
      const product = this.props.productDetail.product;
      if (product.categoryId) {
        this.props.fetchProductsByCategory(product.categoryId);
      }
    }
  }

  getProductIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  };

  handleQuantityChange = (delta) => {
    this.setState(prevState => ({
      quantity: Math.max(1, prevState.quantity + delta)
    }));
  };

  handleImageSelect = (image) => {
    this.setState({ selectedImage: image });
  };

  handleSizeSelect = (size) => {
    this.setState({ selectedSize: size });
  };

  handleColorSelect = (color) => {
    this.setState({ selectedColor: color });
  };

  handleAddToCart = () => {
    const { product } = this.props.productDetail;
    const { quantity, selectedSize, selectedColor } = this.state;
    
    console.log('Adding to cart:', {
      product: product.name,
      quantity,
      size: selectedSize,
      color: selectedColor
    });
    // TODO: Implement cart functionality
  };

  handleBuyNow = () => {
    this.handleAddToCart();
    // TODO: Navigate to checkout
  };

  renderLoading = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading product details...</p>
    </div>
  );

  renderError = () => (
    <div className="text-center py-5">
      <div className="alert alert-danger">
        <h4>Error loading product</h4>
        <p>{this.props.productDetail.error}</p>
        <button className="btn btn-primary" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    </div>
  );

  renderProductImages = (product) => {
    const images = product.productImages || [];
    const mainImage = this.state.selectedImage || 
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
              className={`border me-2 mb-2 ${this.state.selectedImage?.imageUrl === image.imageUrl ? 'border-primary' : 'border-secondary'}`}
              width="75"
              height="75"
              style={{ objectFit: 'cover', cursor: 'pointer' }}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => this.handleImageSelect(image)}
            />
          ))}
        </div>
      </div>
    );
  };

  renderProductInfo = (product) => {
    const { quantity } = this.state;
    const isInStock = product.inventory?.quantity > 0;
    const originalPrice = calculateOriginalPrice(product.price, 10);
    const discountPrice = calculateDiscountPrice(product.price, 10);
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
          <span className="fw-bold h5 me-2">{formatPrice(product.price)}</span>
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
                onClick={() => this.handleQuantityChange(-1)}
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
                onClick={() => this.handleQuantityChange(1)}
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
            onClick={this.handleAddToCart}
            disabled={!isInStock}
          >
            <i className="bi bi-cart-plus me-1"></i>Add to cart
          </button>
          <button
            type="button"
            className="btn btn-sm btn-warning me-2"
            title="Buy now"
            onClick={this.handleBuyNow}
            disabled={!isInStock}
          >
            <i className="bi bi-cart3 me-1"></i>Buy now
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

  getRelatedProducts = () => {
    const { product } = this.props.productDetail;
    const { products } = this.props.products;
    
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
      .map(p => this.formatProduct(p));
    
    console.log('  Related products:', relatedProducts);
    return relatedProducts;
  };

  getProductImage = (product) => {
    const images = product.productImages || [];
    if (images.length > 0) {
      const mainImage = images.find(img => img.isMain) || images[0];
      return mainImage.imageUrl;
    }
    return TECH_PLACEHOLDERS.getPlaceholderByCategory(product.category?.name);
  };

  formatProduct = (product) => {
    // Transform backend product data to match frontend component expectations
    return {
      id: product.id,
      sku: `PC-${product.id}`,
      link: `/product/detail?id=${product.id}`,
      name: product.name,
      img: this.getProductImage(product),
      price: formatPrice(product.price),
      originPrice: calculateOriginalPrice(product.price, 10), // 10% original price markup
      discountPrice: calculateDiscountPrice(product.price, 10), // 10% discount
      discountPercentage: 10,
      isNew: true,
      isHot: product.inventory?.quantity > 0 && product.inventory?.quantity < 5,
      star: Math.round(product.averageRating || 0), // Use backend rating
      isFreeShipping: qualifiesForFreeShipping(product.price, 100), // Free shipping for orders over $100
      description: product.description || "High-quality computer product for your needs",
      category: product.category?.name || "Computer Components",
      brand: product.brand?.name || "Tech Brand",
      stock: product.inventory?.quantity || 0,
      reviewCount: product.reviewCount || 0,
      averageRating: product.averageRating || 0
    };
  };

  render() {
    const { loading, error, product } = this.props.productDetail;

    if (loading) {
      return this.renderLoading();
    }

    if (error) {
      return this.renderError();
    }

    if (!product) {
      return (
        <div className="text-center py-5">
          <h4>Product not found</h4>
          <button className="btn btn-primary" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>
      );
    }

    return (
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-md-8">
            <div className="row mb-3">
              {this.renderProductImages(product)}
              {this.renderProductInfo(product)}
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
                      reviews={this.props.reviews.reviews[product.id] || []}
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
              data={this.getRelatedProducts()} 
              title="Related Products"
            />
            <CardServices />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  productDetail: state.productDetail,
  reviews: state.reviews,
  products: state.products
});

export default connect(mapStateToProps, { fetchProductDetail, fetchReviewsByProductId, fetchProductsByCategory })(ProductDetail);
