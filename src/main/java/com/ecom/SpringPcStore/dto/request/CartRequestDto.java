package com.ecom.SpringPcStore.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CartRequestDto {
    private List<CartItemRequestDto> cartItems;
}
