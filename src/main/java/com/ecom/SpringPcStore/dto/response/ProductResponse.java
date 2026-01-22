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
public class ProductResponse {
    
    private Long id;
    private Long storeId;
    private Long categoryId;
    private Long brandId;
    private String name;
    private BigDecimal price;
    private String status;
    private String description;
    private LocalDateTime createdAt;
    
    // Related data
    private StoreResponse store;
    private CategoryResponse category;
    private BrandResponse brand;
    private List<ProductImageResponse> productImages;
    private List<ProductSpecResponse> productSpecs;
    private InventoryResponse inventory;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StoreResponse {
        private Long id;
        private String name;
        private String status;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryResponse {
        private Long id;
        private String name;
        private Long parentId;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BrandResponse {
        private Long id;
        private String name;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductImageResponse {
        private Long id;
        private String imageUrl;
        private Boolean isMain;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductSpecResponse {
        private Long id;
        private String specKey;
        private String specValue;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InventoryResponse {
        private Long id;
        private Integer quantity;
        private LocalDateTime updatedAt;
    }
}
