package com.ecom.SpringPcStore.dto.request;

import lombok.Data;

@Data
public class UserRequestDto {
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String phoneNumber;
}
