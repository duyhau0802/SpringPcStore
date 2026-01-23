package com.ecom.SpringPcStore.service;

import com.ecom.SpringPcStore.dto.request.PaymentRequest;
import com.ecom.SpringPcStore.dto.response.PaymentResponse;
import com.ecom.SpringPcStore.entity.*;
import com.ecom.SpringPcStore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final StoreCommissionRepository storeCommissionRepository;
    private final OrderItemRepository orderItemRepository;

    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findByIdWithOrder(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        return convertToResponse(payment);
    }

    public Page<PaymentResponse> getPaymentsByOrderId(Long orderId, Pageable pageable) {
        return paymentRepository.findByOrderId(orderId, pageable)
                .map(this::convertToResponse);
    }

    public List<PaymentResponse> getPaymentsByStatus(String status) {
        return paymentRepository.findByStatus(status).stream()
                .map(this::convertToResponse)
                .toList();
    }

    public PaymentResponse createPayment(PaymentRequest request) {
        // Validate order exists
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + request.getOrderId()));

        // Check if order is in payable status
        if (!"PENDING".equals(order.getStatus()) && !"CONFIRMED".equals(order.getStatus())) {
            throw new RuntimeException("Order is not in payable status. Current status: " + order.getStatus());
        }

        // Check if payment amount matches order total
        if (request.getAmount().compareTo(order.getTotalPrice()) != 0) {
            throw new RuntimeException("Payment amount does not match order total. Expected: " + 
                    order.getTotalPrice() + ", Provided: " + request.getAmount());
        }

        // Check if payment already exists
        Optional<Payment> existingPayment = paymentRepository.findByOrderId(request.getOrderId());
        if (existingPayment.isPresent()) {
            throw new RuntimeException("Payment already exists for order: " + request.getOrderId());
        }

        // Create payment
        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setMethod(request.getMethod());
        payment.setAmount(request.getAmount());
        payment.setStatus("PENDING");
        payment.setTransactionId(request.getTransactionId() != null ? 
                request.getTransactionId() : generateTransactionId());
        payment.setPaymentDetails(request.getPaymentDetails());

        Payment savedPayment = paymentRepository.save(payment);

        // Process payment (simulate payment processing)
        PaymentResponse response = processPayment(savedPayment.getId());

        return response;
    }

    public PaymentResponse updatePaymentStatus(Long id, String status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));

        // Validate status transition
        if (!isValidPaymentStatusTransition(payment.getStatus(), status)) {
            throw new RuntimeException("Invalid status transition from " + 
                    payment.getStatus() + " to " + status);
        }

        payment.setStatus(status);
        Payment updatedPayment = paymentRepository.save(payment);

        // Update order status based on payment status
        updateOrderStatusBasedOnPayment(updatedPayment);

        return convertToResponse(updatedPayment);
    }

    public void refundPayment(Long id, String reason) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));

        if (!"COMPLETED".equals(payment.getStatus())) {
            throw new RuntimeException("Cannot refund payment with status: " + payment.getStatus());
        }

        payment.setStatus("REFUNDED");
        payment.setPaymentDetails(payment.getPaymentDetails() + " | Refunded: " + reason);
        paymentRepository.save(payment);

        // Update order status
        Order order = orderRepository.findById(payment.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus("REFUNDED");
        orderRepository.save(order);
    }

    private PaymentResponse processPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Simulate payment processing
        // In a real application, this would integrate with payment gateways
        boolean paymentSuccessful = simulatePaymentGateway(payment);

        if (paymentSuccessful) {
            payment.setStatus("COMPLETED");
            
            // Create store commissions (temporarily disabled for testing)
            // createStoreCommissions(payment);
        } else {
            payment.setStatus("FAILED");
        }

        Payment updatedPayment = paymentRepository.save(payment);
        updateOrderStatusBasedOnPayment(updatedPayment);

        return convertToResponse(updatedPayment);
    }

    private boolean simulatePaymentGateway(Payment payment) {
        // Simple simulation - in reality, this would call actual payment APIs
        // COD is always successful in simulation (customer will pay on delivery)
        return "COD".equals(payment.getMethod()) ||
               "CREDIT_CARD".equals(payment.getMethod()) || 
               "PAYPAL".equals(payment.getMethod()) || 
               "BANK_TRANSFER".equals(payment.getMethod());
    }

    private void createStoreCommissions(Payment payment) {
        Order order = orderRepository.findById(payment.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Group order items by store
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());
        
        orderItems.stream()
                .collect(java.util.stream.Collectors.groupingBy(OrderItem::getStoreId))
                .forEach((storeId, items) -> {
                    BigDecimal storeTotal = items.stream()
                            .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    
                    // Calculate commission (5% for example)
                    BigDecimal commissionRate = BigDecimal.valueOf(0.05); // 5%
                    BigDecimal commissionAmount = storeTotal.multiply(commissionRate);
                    
                    StoreCommission commission = new StoreCommission();
                    commission.setStoreId(storeId);
                    commission.setOrderId(order.getId());
                    commission.setPaymentId(payment.getId());
                    commission.setCommissionAmount(commissionAmount);
                    commission.setCommissionRate(commissionRate);
                    commission.setOrderAmount(storeTotal);
                    commission.setStatus("PENDING");
                    commission.setCreatedAt(LocalDateTime.now());
                    
                    storeCommissionRepository.save(commission);
                });
    }

    private void updateOrderStatusBasedOnPayment(Payment payment) {
        Order order = orderRepository.findById(payment.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        switch (payment.getStatus()) {
            case "COMPLETED" -> {
                if ("PENDING".equals(order.getStatus())) {
                    order.setStatus("CONFIRMED");
                }
            }
            case "FAILED" -> order.setStatus("PAYMENT_FAILED");
            case "REFUNDED" -> order.setStatus("REFUNDED");
        }

        orderRepository.save(order);
    }

    private boolean isValidPaymentStatusTransition(String currentStatus, String newStatus) {
        return switch (currentStatus) {
            case "PENDING" -> List.of("COMPLETED", "FAILED", "CANCELLED").contains(newStatus);
            case "COMPLETED" -> List.of("REFUNDED").contains(newStatus);
            case "FAILED", "CANCELLED", "REFUNDED" -> false; // Final states
            default -> false;
        };
    }

    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private PaymentResponse convertToResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setOrderId(payment.getOrderId());
        response.setMethod(payment.getMethod());
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus());
        response.setTransactionId(payment.getTransactionId());
        response.setPaymentDetails(payment.getPaymentDetails());
        response.setCreatedAt(payment.getCreatedAt());

        // Order info
        if (payment.getOrder() != null) {
            PaymentResponse.OrderResponse orderResponse = new PaymentResponse.OrderResponse();
            orderResponse.setId(payment.getOrder().getId());
            orderResponse.setUserId(payment.getOrder().getUserId());
            orderResponse.setTotalPrice(payment.getOrder().getTotalPrice());
            orderResponse.setStatus(payment.getOrder().getStatus());
            orderResponse.setShippingAddress(payment.getOrder().getShippingAddress());
            response.setOrder(orderResponse);
        }

        return response;
    }
}
