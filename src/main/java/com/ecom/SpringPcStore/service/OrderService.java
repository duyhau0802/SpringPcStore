package com.ecom.SpringPcStore.service;

import com.ecom.SpringPcStore.dto.request.OrderRequest;
import com.ecom.SpringPcStore.dto.response.OrderResponse;
import com.ecom.SpringPcStore.entity.*;
import com.ecom.SpringPcStore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final InventoryRepository inventoryRepository;
    private final CartService cartService;
    private final ProductImageRepository productImageRepository;

    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return convertToResponse(order);
    }

    public Page<OrderResponse> getOrdersByUserId(Long userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable)
                .map(this::convertToResponse);
    }

    public List<OrderResponse> getOrdersByUserIdWithDetails(Long userId) {
        return orderRepository.findByUserIdWithDetails(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByStatus(String status) {
        return orderRepository.findByStatusOrderByCreatedAt(status).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse createOrder(OrderRequest request) {
        // Validate user exists
        userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        // Validate all products and check inventory
        for (OrderRequest.OrderItemRequest itemRequest : request.getOrderItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemRequest.getProductId()));

            if (!"ACTIVE".equals(product.getStatus())) {
                throw new RuntimeException("Product " + product.getName() + " is not available");
            }

            // Check inventory
            var inventoryOpt = inventoryRepository.findAvailableByProductId(itemRequest.getProductId());
            if (inventoryOpt.isEmpty() || inventoryOpt.get().getQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
        }

        // Create order
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setTotalPrice(request.getTotalPrice());
        order.setStatus("PENDING");
        order.setShippingAddress(request.getShippingAddress());

        Order savedOrder = orderRepository.save(order);

        // Create order items and update inventory
        for (OrderRequest.OrderItemRequest itemRequest : request.getOrderItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(savedOrder.getId());
            orderItem.setProductId(itemRequest.getProductId());
            orderItem.setStoreId(itemRequest.getStoreId());
            orderItem.setPrice(itemRequest.getPrice());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItemRepository.save(orderItem);

            // Update inventory
            var inventoryOpt = inventoryRepository.findByProductId(itemRequest.getProductId());
            if (inventoryOpt.isPresent()) {
                Inventory inventory = inventoryOpt.get();
                inventory.setQuantity(inventory.getQuantity() - itemRequest.getQuantity());
                inventoryRepository.save(inventory);
            }
        }

        // Clear user's cart (if exists)
        try {
            cartService.clearCart(request.getUserId());
        } catch (RuntimeException e) {
            // Cart not found - ignore (user might be creating order directly)
        }

        // Fetch order with relationships for response
        Order orderWithDetails = orderRepository.findByIdWithDetails(savedOrder.getId())
                .orElse(savedOrder);

        return convertToResponse(orderWithDetails);
    }

    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        // Validate status transition
        if (!isValidStatusTransition(order.getStatus(), status)) {
            throw new RuntimeException("Invalid status transition from " + order.getStatus() + " to " + status);
        }

        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return convertToResponse(updatedOrder);
    }

    public void cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        if (!"PENDING".equals(order.getStatus()) && !"CONFIRMED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
        }

        // Restore inventory
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(id);
        for (OrderItem item : orderItems) {
            var inventoryOpt = inventoryRepository.findByProductId(item.getProductId());
            if (inventoryOpt.isPresent()) {
                Inventory inventory = inventoryOpt.get();
                inventory.setQuantity(inventory.getQuantity() + item.getQuantity());
                inventoryRepository.save(inventory);
            }
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }

    private boolean isValidStatusTransition(String currentStatus, String newStatus) {
        return switch (currentStatus) {
            case "PENDING" -> List.of("CONFIRMED", "CANCELLED").contains(newStatus);
            case "CONFIRMED" -> List.of("PROCESSING", "CANCELLED").contains(newStatus);
            case "PROCESSING" -> List.of("SHIPPED", "CANCELLED").contains(newStatus);
            case "SHIPPED" -> List.of("DELIVERED").contains(newStatus);
            case "DELIVERED", "CANCELLED" -> false; // Final states
            default -> false;
        };
    }

    private OrderResponse convertToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUserId());
        response.setTotalPrice(order.getTotalPrice());
        response.setStatus(order.getStatus());
        response.setShippingAddress(order.getShippingAddress());
        response.setCreatedAt(order.getCreatedAt());

        // User info
        if (order.getUser() != null) {
            OrderResponse.UserResponse userResponse = new OrderResponse.UserResponse();
            userResponse.setId(order.getUser().getId());
            userResponse.setUsername(order.getUser().getUsername());
            userResponse.setEmail(order.getUser().getEmail());
            userResponse.setFullName(order.getUser().getFullName());
            response.setUser(userResponse);
        }

        // Order items
        if (order.getOrderItems() != null) {
            List<OrderResponse.OrderItemResponse> itemResponses = order.getOrderItems().stream()
                    .map(this::convertOrderItemToResponse)
                    .collect(Collectors.toList());
            response.setOrderItems(itemResponses);
        }

        // Payment info
        if (order.getPayment() != null) {
            OrderResponse.PaymentResponse paymentResponse = new OrderResponse.PaymentResponse();
            paymentResponse.setId(order.getPayment().getId());
            paymentResponse.setMethod(order.getPayment().getMethod());
            paymentResponse.setStatus(order.getPayment().getStatus());
            paymentResponse.setTransactionId(order.getPayment().getTransactionId());
            paymentResponse.setCreatedAt(order.getPayment().getCreatedAt());
            response.setPayment(paymentResponse);
        }

        return response;
    }

    private OrderResponse.OrderItemResponse convertOrderItemToResponse(OrderItem orderItem) {
        OrderResponse.OrderItemResponse response = new OrderResponse.OrderItemResponse();
        response.setId(orderItem.getId());
        response.setOrderId(orderItem.getOrderId());
        response.setProductId(orderItem.getProductId());
        response.setStoreId(orderItem.getStoreId());
        response.setPrice(orderItem.getPrice());
        response.setQuantity(orderItem.getQuantity());
        
        BigDecimal subtotal = orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity()));
        response.setSubtotal(subtotal);

        // Product info
        if (orderItem.getProduct() != null) {
            OrderResponse.OrderItemResponse.ProductResponse productResponse = new OrderResponse.OrderItemResponse.ProductResponse();
            productResponse.setId(orderItem.getProduct().getId());
            productResponse.setName(orderItem.getProduct().getName());
            productResponse.setStatus(orderItem.getProduct().getStatus());
            
            // Get main image
            List<ProductImage> images = productImageRepository.findByProductId(orderItem.getProductId());
            if (!images.isEmpty()) {
                productResponse.setImageUrl(images.get(0).getImageUrl());
            }
            
            response.setProduct(productResponse);
        }

        // Store info
        if (orderItem.getStore() != null) {
            OrderResponse.OrderItemResponse.StoreResponse storeResponse = new OrderResponse.OrderItemResponse.StoreResponse();
            storeResponse.setId(orderItem.getStore().getId());
            storeResponse.setName(orderItem.getStore().getName());
            response.setStore(storeResponse);
        }

        return response;
    }
}
