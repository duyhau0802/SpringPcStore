import { useLocation, Link } from "react-router-dom";

const OrderConfirmationView = () => {
  const location = useLocation();
  const { orderId, paymentId, paymentMethod, totalAmount } = location.state || {};

  if (!orderId) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning">
          <h4>Order Information Not Found</h4>
          <p>Please complete your order first.</p>
          <Link to="/cart" className="btn btn-primary">
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-secondary border-top p-4 text-white mb-3">
        <h1 className="display-6">Order Confirmation</h1>
      </div>
      <div className="container mb-3">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card border-success">
              <div className="card-header bg-success text-white">
                <i className="bi bi-check-circle"></i> Order Placed Successfully!
              </div>
              <div className="card-body text-center py-5">
                <div className="mb-4">
                  <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                </div>
                
                <h3 className="text-success mb-3">Thank You for Your Order!</h3>
                
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="text-muted">Order Number</h6>
                        <h5>#{orderId}</h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="text-muted">Payment Method</h6>
                        <h5>{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Credit Card'}</h5>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-light mb-4">
                  <div className="card-body">
                    <h6 className="text-muted">Total Amount Paid</h6>
                    <h4 className="text-success">${totalAmount?.toFixed(2) || '0.00'}</h4>
                  </div>
                </div>

                <div className="alert alert-info">
                  <i className="bi bi-info-circle"></i> You will receive a confirmation email shortly with your order details.
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <Link to="/orders/my" className="btn btn-primary">
                    <i className="bi bi-list"></i> View My Orders
                  </Link>
                  <Link to="/" className="btn btn-secondary">
                    <i className="bi bi-house"></i> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationView;
