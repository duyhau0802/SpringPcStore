package com.ecom.SpringPcStore.controller;

import com.ecom.SpringPcStore.dto.request.OrderRequest;
import com.ecom.SpringPcStore.dto.response.OrderResponse;
import com.ecom.SpringPcStore.service.OrderService;
import com.ecom.SpringPcStore.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderResponse>> getAllOrders(Pageable pageable) {
        Page<OrderResponse> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @orderSecurity.isOrderOwner(#id, authentication)")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id, Authentication authentication) {
        OrderResponse order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        List<OrderResponse> orders = orderService.getOrdersByUserIdWithDetails(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/my/paged")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<OrderResponse>> getMyOrdersPaged(Pageable pageable, Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        Page<OrderResponse> orders = orderService.getOrdersByUserId(userId, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getOrdersByStatus(@PathVariable String status) {
        List<OrderResponse> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request, Authentication authentication) {
        // Set current user ID
        Long userId = getCurrentUserId(authentication);
        request.setUserId(userId);
        
        OrderResponse createdOrder = orderService.createOrder(request);
        return ResponseEntity.ok(createdOrder);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        OrderResponse updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or @orderSecurity.isOrderOwner(#id, authentication)")
    public ResponseEntity<Map<String, Object>> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order cancelled successfully");
        response.put("orderId", id);
        
        return ResponseEntity.ok(response);
    }

    private Long getCurrentUserId(Authentication authentication) {
        String username = authentication.getName();
        return userService.getUserIdByUsername(username);
    }
}
