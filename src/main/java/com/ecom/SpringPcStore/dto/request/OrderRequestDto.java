package com.ecom.SpringPcStore.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDto {
    private String shippingAddress;
    private List<OrderItemRequestDto> orderItems;
}
