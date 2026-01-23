import { lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, updateCartItemQuantity, removeFromCart } from "../../redux/actions/cartActions";
const CouponApplyForm = lazy(() =>
  import("../../components/others/CouponApplyForm")
);

const CartView = () => {
  const dispatch = useDispatch();
  const { cart, cartItems, loading, error, totalPrice, totalItems } = useSelector((state) => state.cart);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    try {
      await dispatch(updateCartItemQuantity(cartItemId, newQuantity));
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    if (window.confirm('Are you sure you want to remove this item from cart?')) {
      await dispatch(removeFromCart(cartItemId));
    }
  };

  const onSubmitApplyCouponCode = async (values) => {
    alert(JSON.stringify(values));
  };

  if (loading && !cart) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        Error: {error}
      </div>
    );
  }
  return (
    <div>
      <div className="bg-secondary border-top p-4 text-white mb-3">
        <h1 className="display-6">Shopping Cart</h1>
      </div>
      <div className="container mb-3">
        <div className="row">
          <div className="col-md-9">
            <div className="card">
              <div className="table-responsive">
                <table className="table table-borderless">
                  <thead className="text-muted">
                    <tr className="small text-uppercase">
                      <th scope="col">Product</th>
                      <th scope="col" width={120}>
                        Quantity
                      </th>
                      <th scope="col" width={150}>
                        Price
                      </th>
                      <th scope="col" className="text-end" width={130}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems && cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="row">
                              <div className="col-3 d-none d-md-block">
                                <img
                                  src={item.product?.imageUrl || "/images/products/default-product.webp"}
                                  width="80"
                                  alt={item.product?.name || "Product"}
                                  onError={(e) => {
                                    e.target.src = "/images/products/default-product.webp";
                                  }}
                                />
                              </div>
                              <div className="col">
                                <Link
                                  to={`/product/detail/${item.productId}`}
                                  className="text-decoration-none"
                                >
                                  {item.product?.name || 'Product Name'}
                                </Link>
                                <p className="small text-muted">
                                  Sold by: {item.store?.name || 'Unknown Store'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="input-group input-group-sm mw-140">
                              <button
                                className="btn btn-primary text-white"
                                type="button"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={updatingItems.has(item.id) || item.quantity <= 1}
                              >
                                <i className="bi bi-dash-lg"></i>
                              </button>
                              <input
                                type="text"
                                className="form-control text-center"
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value > 0) {
                                    handleQuantityChange(item.id, value);
                                  }
                                }}
                                disabled={updatingItems.has(item.id)}
                              />
                              <button
                                className="btn btn-primary text-white"
                                type="button"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={updatingItems.has(item.id)}
                              >
                                <i className="bi bi-plus-lg"></i>
                              </button>
                            </div>
                          </td>
                          <td>
                            <var className="price">${item.subtotal?.toFixed(2) || '0.00'}</var>
                            <small className="d-block text-muted">
                              ${item.price?.toFixed(2) || '0.00'} each
                            </small>
                          </td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-outline-secondary me-2">
                              <i className="bi bi-heart-fill"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={updatingItems.has(item.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          <p className="mb-0">Your cart is empty</p>
                          <Link to="/" className="btn btn-primary mt-2">
                            Continue Shopping
                          </Link>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="card-footer">
                <Link to="/checkout" className="btn btn-primary float-end" disabled={!cartItems || cartItems.length === 0}>
                  Make Purchase <i className="bi bi-chevron-right"></i>
                </Link>
                <Link to="/" className="btn btn-secondary">
                  <i className="bi bi-chevron-left"></i> Continue shopping
                </Link>
              </div>
            </div>
            <div className="alert alert-success mt-3">
              <p className="m-0">
                <i className="bi bi-truck"></i> Free Delivery within 1-2 weeks
              </p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card mb-3">
              <div className="card-body">
                <CouponApplyForm onSubmit={onSubmitApplyCouponCode} />
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <dl className="row border-bottom">
                  <dt className="col-6">Total price:</dt>
                  <dd className="col-6 text-end">${totalPrice?.toFixed(2) || '0.00'}</dd>

                  <dt className="col-6 text-success">Discount:</dt>
                  <dd className="col-6 text-success text-end">-$0.00</dd>
                  <dt className="col-6 text-success">
                    Coupon:{" "}
                    <span className="small text-muted">EXAMPLECODE</span>{" "}
                  </dt>
                  <dd className="col-6 text-success text-end">-$0.00</dd>
                </dl>
                <dl className="row">
                  <dt className="col-6">Total:</dt>
                  <dd className="col-6 text-end  h5">
                    <strong>${totalPrice?.toFixed(2) || '0.00'}</strong>
                  </dd>
                  <dt className="col-6">Items:</dt>
                  <dd className="col-6 text-end">
                    <strong>{totalItems || 0}</strong>
                  </dd>
                </dl>
                <hr />
                <p className="text-center">
                  <img
                    src="../../images/payment/payments.webp"
                    alt="..."
                    height={26}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-light border-top p-4">
        <div className="container">
          <h6>Payment and refund policy</h6>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartView;
