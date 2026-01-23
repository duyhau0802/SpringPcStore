import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, searchProducts } from "../../redux/actions/productActions";
import Paging from "../../components/Paging";
import Breadcrumb from "../../components/Breadcrumb";
import FilterCategory from "../../components/filter/Category";
import FilterPrice from "../../components/filter/Price";
import FilterStar from "../../components/filter/Star";
import FilterClear from "../../components/filter/Clear";
import CardServices from "../../components/card/CardServices";
import CardProductGrid from "../../components/card/CardProductGrid";
import CardProductList from "../../components/card/CardProductList";
import TECH_PLACEHOLDERS from "../../utils/imagePlaceholders";
import { formatPrice, calculateOriginalPrice, calculateDiscountPrice, qualifiesForFreeShipping } from "../../utils/currencyUtils";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error, pagination } = useSelector(state => state.products);

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("grid");
  const [filters, setFilters] = useState({
    name: null,
    categoryId: null,
    brandId: null,
    minPrice: null,
    maxPrice: null,
    minRating: null,
    sort: "id,desc"
  });
  const [lastUrl, setLastUrl] = useState(window.location.search);

  // Parse URL parameters
  const parseUrlParams = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    const categoryId = urlParams.get('categoryId');
    const minRating = urlParams.get('minRating');
    const sort = urlParams.get('sort');
    
    // Only update state if parameters actually changed
    const filtersToUpdate = {};
    
    if (search !== filters.name) {
      filtersToUpdate.name = search;
    }
    
    if (categoryId !== filters.categoryId) {
      filtersToUpdate.categoryId = categoryId ? parseInt(categoryId) : null;
    }
    
    if (minRating !== filters.minRating) {
      filtersToUpdate.minRating = minRating ? parseFloat(minRating) : null;
    }
    
    if (sort !== filters.sort) {
      filtersToUpdate.sort = sort || 'id,desc';
    }
    
    if (Object.keys(filtersToUpdate).length > 0) {
      setFilters(prev => ({
        ...prev,
        ...filtersToUpdate
      }));
    }
  }, [filters.name, filters.categoryId, filters.minRating, filters.sort]);

  // Load products
  const loadProducts = useCallback(() => {
    const params = {
      page: currentPage - 1, // API uses 0-based indexing
      size: 12,
      sort: filters.sort,
      name: filters.name || undefined,
      categoryId: filters.categoryId || undefined,
      brandId: filters.brandId || undefined,
      storeId: 1, // Default store
      status: 'ACTIVE',
      minRating: filters.minRating || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined
    };

    // Remove null/undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });

    // Debug which API will be called only when filters are applied
    const shouldSearch = filters.name || filters.categoryId || filters.brandId || filters.minRating || filters.minPrice || filters.maxPrice;
    
    if (shouldSearch) {
      console.log('Search filter applied:', {
        name: filters.name,
        categoryId: filters.categoryId,
        brandId: filters.brandId,
        minRating: filters.minRating,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice
      });
      dispatch(searchProducts(params));
    } else {
      dispatch(fetchProducts(params));
    }
  }, [currentPage, filters, dispatch]);

  // Handle page change
  const onPageChanged = (page) => {
    setCurrentPage(page.currentPage);
  };

  // Handle view change
  const onChangeView = (view) => {
    setView(view);
  };

  // Handle sort change
  const onSortChange = (e) => {
    const sortValue = e.target.value;
    let sort = "id,desc";
    
    switch(sortValue) {
      case "1": // Most Popular
        sort = "name,asc";
        break;
      case "2": // Latest items
        sort = "createdAt,desc";
        break;
      case "3": // Trending
        sort = "name,asc";
        break;
      case "4": // Price low to high
        sort = "price,asc";
        break;
      case "5": // Price high to low
        sort = "price,desc";
        break;
      default:
        sort = "id,desc";
    }

    setCurrentPage(1);
    setFilters(prev => ({ ...prev, sort }));
  };

  // Handle filter change
  const onFilterChange = (newFilters) => {
    setCurrentPage(1);
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Format product data
  const formatProduct = (product) => {
    // Transform backend product data to match frontend component expectations
    return {
      id: product.id,
      sku: `PC-${product.id}`,
      link: `/product/detail?id=${product.id}`,
      name: product.name,
      img: getProductImage(product),
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

  // Get product image
  const getProductImage = (product) => {
    // Get main image from productImages or use tech placeholder
    if (product.productImages && product.productImages.length > 0) {
      const mainImage = product.productImages.find(img => img.isMain);
      return mainImage ? mainImage.imageUrl : product.productImages[0].imageUrl;
    }
    // Use category-specific placeholder
    return TECH_PLACEHOLDERS.getPlaceholderByCategory(product.category?.name);
  };

  // Effects
  useEffect(() => {
    parseUrlParams();
    loadProducts();
  }, []); // Only run once on mount

  useEffect(() => {
    const currentUrl = window.location.search;
    
    // Check if URL changed (from navigation)
    if (currentUrl !== lastUrl) {
      setLastUrl(currentUrl);
      parseUrlParams();
    }
  }, [lastUrl, parseUrlParams]);

  useEffect(() => {
    // Load products when filters or page changes
    loadProducts();
  }, [loadProducts]);

  // Render functions
  const renderLoading = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading products...</p>
    </div>
  );

  const renderError = () => (
    <div className="text-center py-5">
      <div className="alert alert-danger">
        <h4>Error loading products</h4>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadProducts}>
          Try Again
        </button>
      </div>
    </div>
  );

  const renderProducts = () => {
    if (products.length === 0) {
      return (
        <div className="text-center py-5">
          <h4>No products found</h4>
          <p>Try adjusting your filters or search terms</p>
        </div>
      );
    }

    return (
      <>
        <div className="row g-3">
          {view === "grid" &&
            products.map((product, idx) => (
              <div key={product.id || idx} className="col-md-4">
                <CardProductGrid data={formatProduct(product)} />
              </div>
            ))}
          {view === "list" &&
            products.map((product, idx) => (
              <div key={product.id || idx} className="col-md-12">
                <CardProductList data={formatProduct(product)} />
              </div>
            ))}
        </div>
        <hr />
        <Paging
          totalRecords={pagination.totalElements}
          pageLimit={12}
          pageNeighbours={3}
          currentPage={currentPage} // Add currentPage prop
          onPageChanged={onPageChanged}
          sizing=""
          alignment="justify-content-center"
        />
      </>
    );
  };

  return (
    <React.Fragment>
      <div
        className="p-5 bg-primary bs-cover"
        style={{
          backgroundImage: "url(../../images/banner/50-Banner.webp)",
        }}
      >
        <div className="container text-center">
          <span className="display-5 px-3 bg-white rounded shadow">
            Tech Store
          </span>
        </div>
      </div>
      <Breadcrumb />
      <div className="container-fluid mb-3">
        <div className="row">
          <div className="col-md-3">
            <FilterCategory onFilterChange={onFilterChange} />
            <FilterPrice onFilterChange={onFilterChange} />
            <FilterStar onFilterChange={onFilterChange} />
            <FilterClear onClear={() => onFilterChange({})} />
            <CardServices />
          </div>
          <div className="col-md-9">
            <div className="row mb-3">
              <div className="col-12">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={filters.name || ''}
                    onChange={(e) => onFilterChange({ name: e.target.value })}
                    aria-label="Search products"
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => onFilterChange({ name: '' })}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-7">
                <span className="align-middle fw-bold">
                  {pagination.totalElements} results
                  {filters.name && (
                    <span className="text-warning"> for "{filters.name}"</span>
                  )}
                </span>
              </div>
              <div className="col-5 d-flex justify-content-end">
                <select
                  className="form-select mw-180 float-start"
                  aria-label="Sort products"
                  onChange={onSortChange}
                >
                  <option value={1}>Most Popular</option>
                  <option value={2}>Latest items</option>
                  <option value={3}>Trending</option>
                  <option value={4}>Price low to high</option>
                  <option value={5}>Price high to low</option>
                </select>
                <div className="btn-group ms-3" role="group">
                  <button
                    aria-label="Grid"
                    type="button"
                    onClick={() => onChangeView("grid")}
                    className={`btn ${
                      view === "grid" ? "btn-primary" : "btn-outline-primary"
                    }`}
                  >
                    <i className="bi bi-grid" />
                  </button>
                  <button
                    aria-label="List"
                    type="button"
                    onClick={() => onChangeView("list")}
                    className={`btn ${
                      view === "list" ? "btn-primary" : "btn-outline-primary"
                    }`}
                  >
                    <i className="bi bi-list" />
                  </button>
                </div>
              </div>
            </div>
            <hr />
            {loading ? renderLoading() : error ? renderError() : renderProducts()}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProductList;
