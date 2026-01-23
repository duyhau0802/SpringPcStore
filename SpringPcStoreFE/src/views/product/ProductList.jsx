import React, { Component } from "react";
import { connect } from "react-redux";
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

class ProductList extends Component {
  state = {
    view: "grid",
    currentPage: 1,
    filters: {
      name: "",
      categoryId: null,
      brandId: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      sort: "id,desc"
    }
  };

  componentDidMount() {
    this.loadProducts();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage !== this.state.currentPage || 
        prevState.filters !== this.state.filters) {
      this.loadProducts();
    }
  }

  loadProducts = () => {
    const { currentPage, filters } = this.state;
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

    console.log('API params:', JSON.stringify(params, null, 2));

    if (filters.name || filters.categoryId || filters.brandId || filters.minRating || filters.minPrice || filters.maxPrice) {
      this.props.searchProducts(params);
    } else {
      this.props.fetchProducts(params);
    }
  };

  onPageChanged = (page) => {
    this.setState({ currentPage: page.currentPage });
  };

  onChangeView = (view) => {
    this.setState({ view });
  };

  onSortChange = (e) => {
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

    this.setState({
      currentPage: 1,
      filters: { ...this.state.filters, sort }
    });
  };

  onFilterChange = (newFilters) => {
    console.log('Filter change:', newFilters);
    this.setState({
      currentPage: 1,
      filters: { ...this.state.filters, ...newFilters }
    });
  };

  renderLoading = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading products...</p>
    </div>
  );

  renderError = () => (
    <div className="text-center py-5">
      <div className="alert alert-danger">
        <h4>Error loading products</h4>
        <p>{this.props.products.error}</p>
        <button className="btn btn-primary" onClick={this.loadProducts}>
          Try Again
        </button>
      </div>
    </div>
  );

  renderProducts = () => {
    const { products, pagination } = this.props.products;
    const { view } = this.state;

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
                <CardProductGrid data={this.formatProduct(product)} />
              </div>
            ))}
          {view === "list" &&
            products.map((product, idx) => (
              <div key={product.id || idx} className="col-md-12">
                <CardProductList data={this.formatProduct(product)} />
              </div>
            ))}
        </div>
        <hr />
        <Paging
          totalRecords={pagination.totalElements}
          pageLimit={12}
          pageNeighbours={3}
          onPageChanged={this.onPageChanged}
          sizing=""
          alignment="justify-content-center"
        />
      </>
    );
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

  getProductImage = (product) => {
    // Get main image from productImages or use tech placeholder
    if (product.productImages && product.productImages.length > 0) {
      const mainImage = product.productImages.find(img => img.isMain);
      return mainImage ? mainImage.imageUrl : product.productImages[0].imageUrl;
    }
    // Use category-specific placeholder
    return TECH_PLACEHOLDERS.getPlaceholderByCategory(product.category?.name);
  };

  render() {
    const { loading, error, pagination } = this.props.products;
    const { view } = this.state;

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
              PC Components & Tech Store
            </span>
          </div>
        </div>
        <Breadcrumb />
        <div className="container-fluid mb-3">
          <div className="row">
            <div className="col-md-3">
              <FilterCategory onFilterChange={this.onFilterChange} />
              <FilterPrice onFilterChange={this.onFilterChange} />
              <FilterStar onFilterChange={this.onFilterChange} />
              <FilterClear onClear={() => this.onFilterChange({})} />
              <CardServices />
            </div>
            <div className="col-md-9">
              <div className="row">
                <div className="col-7">
                  <span className="align-middle fw-bold">
                    {pagination.totalElements} results for{" "}
                    <span className="text-warning">"PC Components"</span>
                  </span>
                </div>
                <div className="col-5 d-flex justify-content-end">
                  <select
                    className="form-select mw-180 float-start"
                    aria-label="Sort products"
                    onChange={this.onSortChange}
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
                      onClick={() => this.onChangeView("grid")}
                      className={`btn ${
                        view === "grid" ? "btn-primary" : "btn-outline-primary"
                      }`}
                    >
                      <i className="bi bi-grid" />
                    </button>
                    <button
                      aria-label="List"
                      type="button"
                      onClick={() => this.onChangeView("list")}
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
              {loading ? this.renderLoading() : error ? this.renderError() : this.renderProducts()}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  products: state.products
});

export default connect(mapStateToProps, { fetchProducts, searchProducts })(ProductList);
