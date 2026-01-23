import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderAPI } from "../../services/orderAPI";

const OrdersView = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (order) => {
    // Navigate to payment page for this specific order
    navigate(`/orders/${order.id}/payment`, { 
      state: { order } 
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'PENDING': 'bg-warning',
      'CONFIRMED': 'bg-info',
      'PROCESSING': 'bg-primary',
      'SHIPPED': 'bg-secondary',
      'DELIVERED': 'bg-success',
      'CANCELLED': 'bg-danger'
    };
    
    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
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
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={fetchMyOrders}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-secondary border-top p-4 text-white mb-3">
        <h1 className="display-6">My Orders</h1>
      </div>
      <div className="container mb-3">
        <div className="row">
          <div className="col-12">
            {orders.length === 0 ? (
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="bi bi-box-seam text-muted" style={{ fontSize: '3rem' }}></i>
                  <h4 className="mt-3 text-muted">No Orders Yet</h4>
                  <p className="text-muted">You haven't placed any orders yet.</p>
                  <Link to="/" className="btn btn-primary">
                    <i className="bi bi-cart"></i> Start Shopping
                  </Link>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-list"></i> Order History ({orders.length} orders)
                  </h5>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td>
                              <strong>#{order.id}</strong>
                            </td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td>
                              {order.orderItems?.length || 0} items
                            </td>
                            <td>
                              <strong>${order.totalPrice?.toFixed(2) || '0.00'}</strong>
                            </td>
                            <td>
                              {getStatusBadge(order.status)}
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm" role="group">
                                <button 
                                  className="btn btn-outline-primary"
                                  onClick={() => navigate(`/orders/${order.id}`)}
                                >
                                  <i className="bi bi-eye"></i> View
                                </button>
                                {order.status === 'PENDING' && (
                                  <button 
                                    className="btn btn-success"
                                    onClick={() => handlePayment(order)}
                                  >
                                    <i className="bi bi-credit-card"></i> Pay
                                  </button>
                                )}
                                {order.status === 'PENDING' && (
                                  <button 
                                    className="btn btn-outline-danger"
                                    onClick={() => handleCancelOrder(order.id)}
                                  >
                                    <i className="bi bi-x-circle"></i> Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const handleCancelOrder = async (orderId) => {
  if (!window.confirm('Are you sure you want to cancel this order?')) {
    return;
  }

  try {
    await orderAPI.cancelOrder(orderId);
    alert('Order cancelled successfully');
    // Refresh the orders list
    window.location.reload();
  } catch (error) {
    console.error('Error cancelling order:', error);
    alert('Failed to cancel order: ' + (error.response?.data?.message || error.message));
  }
};

export default OrdersView;
