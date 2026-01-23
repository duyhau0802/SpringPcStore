package com.ecom.SpringPcStore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    
    private Long id;
    private Long orderId;
    private String method;
    private BigDecimal amount;
    private String status;
    private String transactionId;
    private String paymentDetails;
    private LocalDateTime createdAt;
    
    private OrderResponse order;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderResponse {
        private Long id;
        private Long userId;
        private BigDecimal totalPrice;
        private String status;
        private String shippingAddress;
    }
}
