package com.ecom.SpringPcStore.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemRequestDto {
    private Long productId;
    private BigDecimal price;
    private Integer quantity;
}
