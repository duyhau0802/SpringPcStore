import { useNavigate } from "react-router-dom";

const CardFeaturedProduct = (props) => {
  const products = props.data || [];
  const title = props.title || "Featured Products";
  const navigate = useNavigate();
  
  console.log('CardFeaturedProduct - props:', props);
  console.log('CardFeaturedProduct - products:', products);
  
  const handleProductClick = (link) => {
    console.log('Navigating to:', link);
    navigate(link);
  };
  
  if (!products || products.length === 0) {
    return (
      <div className="card mb-3">
        <div className="card-header fw-bold text-uppercase">
          {title}
        </div>
        <div className="card-body text-center text-muted">
          No products available
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-3">
      <div className="card-header fw-bold text-uppercase">
        {title}
      </div>
      <div className="card-body">
        {products.map((product, idx) => {
          console.log(`Product ${idx}:`, product);
          return (
            <div
              className={`row ${idx + 1 === products.length ? "" : "mb-3"}`}
              key={product.id || idx}
            >
              <div className="col-md-4">
                <div 
                  onClick={() => handleProductClick(product.link)}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <img 
                    src={product.img} 
                    className="img-fluid" 
                    alt={product.name}
                  />
                </div>
              </div>
              <div className="col-md-8">
                <h6 className="text-capitalize mb-1">
                  <span 
                    onClick={() => handleProductClick(product.link)}
                    style={{ 
                      cursor: 'pointer',
                      color: '#212529',
                      textDecoration: 'none'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.textDecoration = 'underline';
                      e.target.style.color = '#0d6efd';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.textDecoration = 'none';
                      e.target.style.color = '#212529';
                    }}
                  >
                    {product.name}
                  </span>
                </h6>
                <div className="mb-2">
                  {Array.from({ length: product.star || 0 }, (_, key) => (
                    <i className="bi bi-star-fill text-warning me-1" key={key} />
                  ))}
                  {product.reviewCount > 0 && (
                    <small className="text-muted">({product.reviewCount})</small>
                  )}
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold h5 mb-0">{product.price}</span>
                  {product.originPrice && product.originPrice > product.price && (
                    <del className="small text-muted ms-2">
                      {product.originPrice}
                    </del>
                  )}
                </div>
                {product.isHot && (
                  <span className="badge bg-danger me-2">Hot</span>
                )}
                {product.isNew && (
                  <span className="badge bg-success me-2">New</span>
                )}
                {product.isFreeShipping && (
                  <small className="text-success d-block">
                    <i className="bi bi-truck me-1"></i>Free Shipping
                  </small>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardFeaturedProduct;
