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
public class CartResponse {
    
    private Long id;
    private Long userId;
    private LocalDateTime createdAt;
    
    private List<CartItemResponse> cartItems;
    private BigDecimal totalPrice;
    private Integer totalItems;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {
        private Long id;
        private Long cartId;
        private Long productId;
        private Long storeId;
        private Integer quantity;
        private BigDecimal price;
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
}
