package com.ecom.SpringPcStore.dto.response;

import lombok.Data;

@Data
public class RegisterResponseDto {
    private String message;
    private UserResponseDto user;
}
