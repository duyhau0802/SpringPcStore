package com.ecom.SpringPcStore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponse {
    
    private Long id;
    private Long storeId;
    private Long productId;
    private Integer quantity;
    private LocalDateTime updatedAt;
    
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
