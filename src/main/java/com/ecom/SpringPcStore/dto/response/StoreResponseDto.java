package com.ecom.SpringPcStore.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StoreResponseDto {
    private Long id;
    private String name;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private UserResponseDto owner;
}
