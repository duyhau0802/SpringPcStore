package com.ecom.SpringPcStore.dto.response;

import lombok.Data;

@Data
public class LoginResponseDto {
    private String token;
    private String type = "Bearer";
    private UserResponseDto user;
}
