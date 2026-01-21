package com.ecom.SpringPcStore.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemResponseDto {
    private Long id;
    private BigDecimal price;
    private Integer quantity;
    private ProductResponseDto product;
    private StoreResponseDto store;
}
