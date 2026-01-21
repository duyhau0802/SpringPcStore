package com.ecom.SpringPcStore.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductResponseDto {
    private Long id;
    private String name;
    private BigDecimal price;
    private String status;
    private String description;
    private LocalDateTime createdAt;
    private StoreResponseDto store;
    private CategoryResponseDto category;
    private BrandResponseDto brand;
    private List<ProductImageResponseDto> productImages;
    private List<ProductSpecResponseDto> productSpecs;
}
