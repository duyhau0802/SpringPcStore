package com.ecom.SpringPcStore.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDto {
    private Long id;
    private BigDecimal totalPrice;
    private String status;
    private String shippingAddress;
    private LocalDateTime createdAt;
    private UserResponseDto user;
    private List<OrderItemResponseDto> orderItems;
}
