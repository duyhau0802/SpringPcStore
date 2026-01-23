import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { paymentAPI } from "../../services/paymentAPI";

const OrderPaymentView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Dummy payment data
  const dummyPaymentData = {
    cardName: "John Doe",
    cardNumber: "4111111111111111",
    expMonth: "12",
    expYear: "2025",
    cvv: "123"
  };

  if (!order) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning">
          <h4>Order Information Not Found</h4>
          <p>Please select an order to make payment.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/orders')}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Check authentication token
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      console.log('Authentication check:', {
        hasToken: !!token,
        tokenLength: token?.length,
        user: user ? JSON.parse(user) : null
      });
      
      let paymentDetails = '';
      
      if (paymentMethod === 'COD') {
        paymentDetails = paymentAPI.generatePaymentDetails('COD');
      } else if (paymentMethod === 'CREDIT_CARD') {
        // Get card info from form
        const cardNumberInput = document.querySelector('input[placeholder="Card number"]');
        const cardNumber = cardNumberInput?.value || dummyPaymentData.cardNumber;
        
        paymentDetails = paymentAPI.generatePaymentDetails('CREDIT_CARD', {
          cardNumber: cardNumber
        });
      }

      const paymentData = paymentAPI.formatPaymentRequest(
        order.id,
        paymentMethod,
        order.totalPrice,
        paymentDetails
      );

      console.log('Creating payment with data:', paymentData);
      console.log('Order details:', order);

      const response = await paymentAPI.createPayment(paymentData);
      const payment = response.data;

      console.log('Payment created successfully:', payment);
      alert(`Payment processed successfully! Payment ID: ${payment.id}`);
      
      // Redirect back to orders page to see updated status
      navigate('/orders');
      
    } catch (error) {
      console.error('Error processing payment:', error);
      
      // Detailed error logging
      if (error.response) {
        console.log('Error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // Log specific validation errors
        if (error.response.data && typeof error.response.data === 'object') {
          console.log('Validation errors:', error.response.data);
        }
      }
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          alert('Please login to process payment');
          navigate('/login');
        } else if (status === 403) {
          alert('Access denied. You may not own this order or have permission to pay for it.');
        } else if (status === 400) {
          alert('Invalid payment data: ' + (data.message || 'Please check your payment information.'));
        } else {
          alert('Failed to process payment: ' + (data.message || `Server error (${status})`));
        }
      } else if (error.request) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('Error processing payment: ' + error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="bg-secondary border-top p-4 text-white mb-3">
        <h1 className="display-6">Order Payment</h1>
      </div>
      <div className="container mb-3">
        <div className="row">
          <div className="col-md-8">
            {/* Order Summary */}
            <div className="card mb-3">
              <div className="card-header">
                <i className="bi bi-receipt"></i> Order Summary
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-2">
                      <strong>Order ID:</strong> #{order.id}
                    </div>
                    <div className="mb-2">
                      <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-2">
                      <strong>Status:</strong> 
                      <span className="badge bg-warning ms-2">{order.status}</span>
                    </div>
                    <div className="mb-2">
                      <strong>Total Amount:</strong> 
                      <span className="text-success ms-2">${order.totalPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>
                {order.shippingAddress && (
                  <div className="mt-3">
                    <strong>Shipping Address:</strong><br/>
                    <span className="text-muted">{order.shippingAddress}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="card mb-3 border-info">
              <div className="card-header bg-info">
                <i className="bi bi-credit-card-2-front"></i> Payment Method
              </div>
              <div className="card-body">
                <div className="row g-3 mb-3 border-bottom">
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        id="cod"
                        name="paymentMethod"
                        type="radio"
                        className="form-check-input"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                      />
                      <label className="form-check-label" htmlFor="cod">
                        Cash on Delivery
                        <i className="bi bi-cash ms-3"></i>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        id="credit"
                        name="paymentMethod"
                        type="radio"
                        className="form-check-input"
                        value="CREDIT_CARD"
                        checked={paymentMethod === 'CREDIT_CARD'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                      />
                      <label className="form-check-label" htmlFor="credit">
                        Credit card
                        <img
                          src="../../images/payment/cards.webp"
                          alt="..."
                          className="ms-3"
                          height={26}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Credit Card Form - Show only when credit card is selected */}
                {paymentMethod === 'CREDIT_CARD' && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name on card"
                        defaultValue={dummyPaymentData.cardName}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Card number"
                        defaultValue={dummyPaymentData.cardNumber}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Expiration month"
                        defaultValue={dummyPaymentData.expMonth}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Expiration year"
                        defaultValue={dummyPaymentData.expYear}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="CVV"
                        defaultValue={dummyPaymentData.cvv}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="card-footer border-info d-grid">
                <button 
                  type="button" 
                  className="btn btn-info"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      Process Payment <strong>${order.totalPrice?.toFixed(2) || '0.00'}</strong>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/orders')}
              >
                <i className="bi bi-arrow-left"></i> Back to Orders
              </button>
            </div>
          </div>

          {/* Order Items */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <i className="bi bi-cart3"></i> Order Items{" "}
                <span className="badge bg-secondary float-end">{order.orderItems?.length || 0}</span>
              </div>
              <ul className="list-group list-group-flush">
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item, index) => (
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
                    <p className="mb-0 text-muted">No items in order</p>
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
                  <strong>${order.totalPrice?.toFixed(2) || '0.00'}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentView;
