import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { orderAPI } from "../../services/orderAPI";
import { paymentAPI } from "../../services/paymentAPI";

const OrderDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const orderResponse = await orderAPI.getOrderById(id);
      setOrder(orderResponse.data);
      
      // Fetch payments for this order
      try {
        console.log('Fetching payments for order ID:', id);
        const paymentsResponse = await paymentAPI.getPaymentsByOrderId(id);
        console.log('Payments response:', paymentsResponse.data);
        
        // Handle both paginated and non-paginated responses
        const paymentsData = paymentsResponse.data.content || paymentsResponse.data;
        console.log('Payments data:', paymentsData);
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      } catch (paymentError) {
        console.log('Error fetching payments:', paymentError);
        console.log('Payment error response:', paymentError.response?.data);
        setPayments([]);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'PENDING': 'bg-warning',
      'CONFIRMED': 'bg-info',
      'PROCESSING': 'bg-primary',
      'SHIPPED': 'bg-secondary',
      'DELIVERED': 'bg-success',
      'CANCELLED': 'bg-danger',
      'PAYMENT_FAILED': 'bg-danger'
    };
    
    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'} fs-6`}>
        {status}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusClasses = {
      'PENDING': 'bg-warning',
      'COMPLETED': 'bg-success',
      'FAILED': 'bg-danger',
      'REFUNDED': 'bg-info'
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadReceipt = () => {
    // Generate simple receipt content
    const receiptContent = `
ORDER RECEIPT
===============
Order ID: #${order.id}
Order Date: ${formatDate(order.createdAt)}
Status: ${order.status}

CUSTOMER INFORMATION
===================
User ID: ${order.user?.id || 'N/A'}
Email: ${order.user?.email || 'N/A'}

ORDER ITEMS
=============
${order.orderItems?.map(item => 
  `${item.product?.name || 'Product'} - ${item.quantity}x $${item.price?.toFixed(2)} = $${(item.subtotal || (item.price * item.quantity))?.toFixed(2)}`
).join('\n')}

SUBTOTAL: $${order.totalPrice?.toFixed(2) || '0.00'}
TOTAL: $${order.totalPrice?.toFixed(2) || '0.00'}

SHIPPING INFORMATION
===================
${order.shippingAddress || 'N/A'}

PAYMENT INFORMATION
==================
${payments.map(payment => 
  `Payment Method: ${payment.method}
Amount: $${payment.amount?.toFixed(2) || '0.00'}
Status: ${payment.status}
Transaction ID: ${payment.transactionId || 'N/A'}
Payment Details: ${payment.paymentDetails || 'N/A'}
---
`).join('')}

Thank you for your order!
    `.trim();

    // Create and download file
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-order-${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getOrderTimeline = () => {
    const timeline = [];
    
    // Order created
    timeline.push({
      date: order.createdAt,
      title: 'Order Placed',
      description: `Order #${order.id} was placed successfully`,
      status: 'completed'
    });

    // Payment events
    payments.forEach(payment => {
      timeline.push({
        date: payment.createdAt,
        title: `Payment ${payment.status}`,
        description: `${payment.method} payment of $${payment.amount?.toFixed(2)} ${payment.status.toLowerCase()}`,
        status: payment.status === 'COMPLETED' ? 'completed' : payment.status === 'FAILED' ? 'error' : 'pending'
      });
    });

    // Order status changes (simplified - in real app, this would come from order history table)
    if (order.status === 'CONFIRMED') {
      timeline.push({
        date: order.updatedAt || order.createdAt,
        title: 'Order Confirmed',
        description: 'Order has been confirmed and is being processed',
        status: 'completed'
      });
    }

    if (order.status === 'PROCESSING') {
      timeline.push({
        date: order.updatedAt || order.createdAt,
        title: 'Order Processing',
        description: 'Your order is being prepared for shipment',
        status: 'active'
      });
    }

    if (order.status === 'SHIPPED') {
      timeline.push({
        date: order.updatedAt || order.createdAt,
        title: 'Order Shipped',
        description: 'Your order has been shipped and is on its way',
        status: 'completed'
      });
    }

    if (order.status === 'DELIVERED') {
      timeline.push({
        date: order.updatedAt || order.createdAt,
        title: 'Order Delivered',
        description: 'Your order has been delivered successfully',
        status: 'completed'
      });
    }

    if (order.status === 'CANCELLED') {
      timeline.push({
        date: order.updatedAt || order.createdAt,
        title: 'Order Cancelled',
        description: 'Order has been cancelled',
        status: 'error'
      });
    }

    return timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
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
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={fetchOrderDetails}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning">
          <h4>Order Not Found</h4>
          <p>The order you're looking for doesn't exist.</p>
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

  return (
    <div>
      <div className="bg-secondary border-top p-4 text-white mb-3">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="display-6">Order Details</h1>
            <button 
              className="btn btn-outline-light"
              onClick={() => navigate('/orders')}
            >
              <i className="bi bi-arrow-left"></i> Back to Orders
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mb-3">
        <div className="row">
          <div className="col-md-8">
            {/* Order Header */}
            <div className="card mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-receipt"></i> Order #{order.id}
                </h5>
                <div className="d-flex gap-2">
                  {getStatusBadge(order.status)}
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleDownloadReceipt}
                  >
                    <i className="bi bi-download"></i> Download Receipt
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-2"><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
                    <p className="mb-2"><strong>Total Amount:</strong> <span className="text-success">${order.totalPrice?.toFixed(2) || '0.00'}</span></p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2"><strong>Items:</strong> {order.orderItems?.length || 0} items</p>
                    <p className="mb-2"><strong>Last Updated:</strong> {formatDate(order.updatedAt || order.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-cart3"></i> Order Items
                </h5>
              </div>
              <div className="card-body">
                {order.orderItems && order.orderItems.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderItems.map((item, index) => (
                          <tr key={item.id || index}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="me-3">
                                  {item.product?.imageUrl ? (
                                    <img src={item.product.imageUrl} alt={item.product?.name} 
                                         style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                  ) : (
                                    <div className="bg-secondary d-flex align-items-center justify-content-center" 
                                         style={{ width: '50px', height: '50px' }}>
                                      <i className="bi bi-image text-white"></i>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h6 className="mb-0">
                                    {item.product?.id ? (
                                      <Link to={`/product/detail?id=${item.product.id}`} className="text-decoration-none">
                                        {item.product?.name || 'Product Name'}
                                      </Link>
                                    ) : (
                                      <span>{item.product?.name || 'Product Name'}</span>
                                    )}
                                  </h6>
                                  <small className="text-muted">Store ID: {item.storeId}</small>
                                </div>
                              </div>
                            </td>
                            <td>${item.price?.toFixed(2) || '0.00'}</td>
                            <td>{item.quantity}</td>
                            <td><strong>${(item.subtotal || (item.price * item.quantity))?.toFixed(2) || '0.00'}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="table-light">
                          <th colSpan="3">Total</th>
                          <th><strong>${order.totalPrice?.toFixed(2) || '0.00'}</strong></th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted">No items in this order</p>
                )}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-clock-history"></i> Order Timeline
                </h5>
              </div>
              <div className="card-body">
                <div className="timeline">
                  {getOrderTimeline().map((event, index) => (
                    <div key={index} className="d-flex mb-3">
                      <div className="me-3">
                        <div className={`rounded-circle d-flex align-items-center justify-content-center ${
                          event.status === 'completed' ? 'bg-success' : 
                          event.status === 'error' ? 'bg-danger' : 
                          event.status === 'active' ? 'bg-primary' : 'bg-warning'
                        }`} style={{ width: '40px', height: '40px' }}>
                          <i className={`bi ${
                            event.status === 'completed' ? 'bi-check' : 
                            event.status === 'error' ? 'bi-x' : 
                            event.status === 'active' ? 'bi-arrow-repeat' : 'bi-clock'
                          } text-white`}></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{event.title}</h6>
                        <p className="mb-1 text-muted">{event.description}</p>
                        <small className="text-muted">{formatDate(event.date)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            {/* Shipping Information */}
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-truck"></i> Shipping Information
                </h5>
              </div>
              <div className="card-body">
                <p className="mb-2"><strong>Shipping Address:</strong></p>
                <p className="text-muted">{order.shippingAddress || 'Not provided'}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-credit-card"></i> Payment Information
                </h5>
              </div>
              <div className="card-body">
                {payments.length > 0 ? (
                  payments.map((payment, index) => (
                    <div key={payment.id || index} className="mb-3 pb-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>{payment.method}</strong>
                        {getPaymentStatusBadge(payment.status)}
                      </div>
                      <p className="mb-1"><strong>Amount:</strong> ${payment.amount?.toFixed(2) || '0.00'}</p>
                      <p className="mb-1"><strong>Transaction ID:</strong> {payment.transactionId || 'N/A'}</p>
                      <p className="mb-1"><strong>Payment Details:</strong> {payment.paymentDetails || 'N/A'}</p>
                      <p className="mb-0"><strong>Date:</strong> {formatDate(payment.createdAt)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No payment information available</p>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-person"></i> Customer Information
                </h5>
              </div>
              <div className="card-body">
                <p className="mb-1"><strong>Customer ID:</strong> {order.user?.id || 'N/A'}</p>
                <p className="mb-1"><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
                <p className="mb-0"><strong>Username:</strong> {order.user?.username || 'N/A'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <div className="card-body">
                <div className="d-grid gap-2">
                  {order.status === 'PENDING' && (
                    <button 
                      className="btn btn-warning"
                      onClick={() => navigate(`/orders/${order.id}/payment`)}
                    >
                      <i className="bi bi-credit-card"></i> Complete Payment
                    </button>
                  )}
                  <button className="btn btn-outline-secondary">
                    <i className="bi bi-envelope"></i> Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailView;
