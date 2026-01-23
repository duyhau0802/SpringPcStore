package com.ecom.SpringPcStore.security;

import com.ecom.SpringPcStore.dto.response.PaymentResponse;
import com.ecom.SpringPcStore.dto.response.OrderResponse;
import com.ecom.SpringPcStore.service.PaymentService;
import com.ecom.SpringPcStore.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("paymentSecurity")
@RequiredArgsConstructor
public class PaymentSecurity {

    private final PaymentService paymentService;
    private final OrderService orderService;

    public boolean isPaymentOwner(Long paymentId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        try {
            PaymentResponse payment = paymentService.getPaymentById(paymentId);
            OrderResponse order = orderService.getOrderById(payment.getOrderId());
            String currentUsername = authentication.getName();
            
            return order.getUser() != null && 
                   order.getUser().getUsername().equals(currentUsername);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isOrderOwner(Long orderId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        try {
            OrderResponse order = orderService.getOrderById(orderId);
            String currentUsername = authentication.getName();
            
            return order.getUser() != null && 
                   order.getUser().getUsername().equals(currentUsername);
        } catch (Exception e) {
            return false;
        }
    }
}
