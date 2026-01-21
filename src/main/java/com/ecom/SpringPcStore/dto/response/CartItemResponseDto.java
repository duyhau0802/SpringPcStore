package com.ecom.SpringPcStore.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartItemResponseDto {
    private Long id;
    private Integer quantity;
    private BigDecimal price;
    private ProductResponseDto product;
    private StoreResponseDto store;
}
