import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { orderAPI } from "../../services/orderAPI";

const CheckoutView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalPrice, totalItems } = useSelector((state) => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get cart data from location state or fallback to Redux store
  const checkoutCartData = location.state?.cartData || {
    cartItems: cartItems || [],
    totalPrice: totalPrice || 0,
    totalItems: totalItems || 0
  };

  // Dummy data for testing
  const dummyData = {
    email: "test.user@example.com",
    phone: "123-456-7890",
    shippingName: "John Doe",
    shippingAddress: "123 Main Street",
    shippingAddress2: "Apt 4B",
    shippingCity: "Los Angeles",
    shippingCountry: "United States",
    shippingState: "California",
    shippingZip: "90210",
    billingName: "John Doe",
    billingAddress: "123 Main Street",
    billingAddress2: "Apt 4B",
    billingCountry: "United States",
    billingState: "California",
    billingZip: "90210",
    cardName: "John Doe",
    cardNumber: "4111111111111111",
    expMonth: "12",
    expYear: "2025",
    cvv: "123"
  };

  const handlePlaceOrder = async () => {
    if (!checkoutCartData.cartItems || checkoutCartData.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Get shipping address from input
      const shippingAddressInput = document.querySelector('input[placeholder="Full Address"]');
      const shippingAddress = shippingAddressInput?.value || dummyData.shippingAddress + ", " + dummyData.shippingAddress2 + ", " + dummyData.shippingCity + ", " + dummyData.shippingState + " " + dummyData.shippingZip + ", " + dummyData.shippingCountry;

      // Create order using API service
      const orderData = orderAPI.formatOrderRequest(
        checkoutCartData.totalPrice,
        shippingAddress,
        checkoutCartData.cartItems
      );

      console.log('Creating order with data:', orderData);

      const response = await orderAPI.createOrder(orderData);
      const order = response.data;

      console.log('Order created successfully:', order);
      alert('Order created successfully! Order ID: ' + order.id);
      
      // Redirect to payment page with order data
      navigate('/orders', { 
        state: { 
          orderData: {
            orderId: order.id,
            cartItems: checkoutCartData.cartItems,
            totalPrice: checkoutCartData.totalPrice,
            totalItems: checkoutCartData.totalItems,
            shippingAddress: shippingAddress
          }
        } 
      });
      
    } catch (error) {
      console.error('Error creating order:', error);
      
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          alert('Please login to place an order');
          window.location.href = '/login';
        } else if (status === 403) {
          alert('Access denied. You do not have permission to create orders.');
        } else if (status === 400) {
          alert('Invalid order data: ' + (data.message || 'Please check your order information.'));
        } else {
          alert('Failed to create order: ' + (data.message || `Server error (${status})`));
        }
      } else if (error.request) {
        // Request was made but no response received
        alert('Network error. Please check your connection and try again.');
      } else {
        // Other error
        alert('Error creating order: ' + error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="bg-secondary border-top p-4 text-white mb-3">
        <h1 className="display-6">Checkout</h1>
      </div>
      <div className="container mb-3">
        <div className="row">
          <div className="col-md-8">
            <div className="card mb-3">
              <div className="card-header">
                <i className="bi bi-truck"></i> Shipping Information
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-12">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Full Address"
                      required
                      defaultValue={dummyData.shippingAddress + ", " + dummyData.shippingAddress2 + ", " + dummyData.shippingCity + ", " + dummyData.shippingState + " " + dummyData.shippingZip + ", " + dummyData.shippingCountry}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-3 border-info">
              <div className="card-header bg-info">
                <i className="bi bi-credit-card-2-front"></i> Order Confirmation
              </div>
              <div className="card-body">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle"></i> Click "Place Order" to create your order. Payment processing will be handled separately.
                </div>
              </div>
              <div className="card-footer border-info d-grid">
                <button 
                  type="button" 
                  className="btn btn-info"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !checkoutCartData.cartItems || checkoutCartData.cartItems.length === 0}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order <strong>${checkoutCartData.totalPrice?.toFixed(2) || '0.00'}</strong>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <i className="bi bi-cart3"></i> Cart{" "}
                <span className="badge bg-secondary float-end">{checkoutCartData.totalItems}</span>
              </div>
              <ul className="list-group list-group-flush">
                {checkoutCartData.cartItems && checkoutCartData.cartItems.length > 0 ? (
                  checkoutCartData.cartItems.map((item, index) => (
                    <li key={item.id || index} className="list-group-item d-flex justify-content-between lh-sm">
                      <div>
                        <h6 className="my-0">{item.product?.name || 'Product Name'}</h6>
                        <small className="text-muted">
                          {item.quantity} × ${item.price?.toFixed(2) || '0.00'}
                        </small>
                      </div>
                      <span className="text-muted">
                        ${(item.subtotal || (item.price * item.quantity))?.toFixed(2) || '0.00'}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-center py-3">
                    <p className="mb-0 text-muted">Your cart is empty</p>
                    <Link to="/cart" className="btn btn-primary btn-sm mt-2">
                      Back to Cart
                    </Link>
                  </li>
                )}
                <li className="list-group-item d-flex justify-content-between bg-light">
                  <div className="text-success">
                    <h6 className="my-0">Promo code</h6>
                    <small>EXAMPLECODE</small>
                  </div>
                  <span className="text-success">−$0.00</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Total (USD)</span>
                  <strong>${checkoutCartData.totalPrice?.toFixed(2) || '0.00'}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
