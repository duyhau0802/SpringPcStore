package com.ecom.SpringPcStore.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequestDto {
    private String name;
    private BigDecimal price;
    private String status;
    private String description;
    private Long storeId;
    private Long categoryId;
    private Long brandId;
    private List<ProductImageRequestDto> productImages;
    private List<ProductSpecRequestDto> productSpecs;
}
