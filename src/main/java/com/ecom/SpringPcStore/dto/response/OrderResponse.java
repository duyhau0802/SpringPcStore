package com.ecom.SpringPcStore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    
    private Long id;
    private Long userId;
    private BigDecimal totalPrice;
    private String status;
    private String shippingAddress;
    private LocalDateTime createdAt;
    
    private UserResponse user;
    private List<OrderItemResponse> orderItems;
    private PaymentResponse payment;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String username;
        private String email;
        private String fullName;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        private Long id;
        private Long orderId;
        private Long productId;
        private Long storeId;
        private BigDecimal price;
        private Integer quantity;
        private BigDecimal subtotal;
        
        private ProductResponse product;
        private StoreResponse store;
        
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class ProductResponse {
            private Long id;
            private String name;
            private String status;
            private String imageUrl;
        }
        
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class StoreResponse {
            private Long id;
            private String name;
        }
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentResponse {
        private Long id;
        private String method;
        private String status;
        private String transactionId;
        private LocalDateTime createdAt;
    }
}
