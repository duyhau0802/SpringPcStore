package com.ecom.SpringPcStore.dto.request;

import lombok.Data;

@Data
public class StoreRequestDto {
    private String name;
    private String description;
    private Long ownerId;
}
