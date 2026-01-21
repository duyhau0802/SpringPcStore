package com.ecom.SpringPcStore.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CartResponseDto {
    private Long id;
    private LocalDateTime createdAt;
    private UserResponseDto user;
    private List<CartItemResponseDto> cartItems;
}
