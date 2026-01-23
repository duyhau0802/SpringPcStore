package com.ecom.SpringPcStore.security;

import com.ecom.SpringPcStore.dto.response.OrderResponse;
import com.ecom.SpringPcStore.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("orderSecurity")
@RequiredArgsConstructor
public class OrderSecurity {

    private final OrderService orderService;

    public boolean isOrderOwner(Long orderId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        try {
            // Get order and check if it belongs to current user
            OrderResponse order = orderService.getOrderById(orderId);
            String currentUsername = authentication.getName();
            
            // For now, we'll need to implement a method to get user ID from username
            // This is a simplified check - in production, you'd want to cache this
            return order.getUser() != null && 
                   order.getUser().getUsername().equals(currentUsername);
        } catch (Exception e) {
            return false;
        }
    }
}
