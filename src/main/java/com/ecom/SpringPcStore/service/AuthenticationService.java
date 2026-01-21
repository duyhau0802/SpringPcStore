package com.ecom.SpringPcStore.service;

import com.ecom.SpringPcStore.dto.request.LoginRequestDto;
import com.ecom.SpringPcStore.dto.request.RegisterRequestDto;
import com.ecom.SpringPcStore.dto.response.LoginResponseDto;
import com.ecom.SpringPcStore.dto.response.RegisterResponseDto;

public interface AuthenticationService {
    RegisterResponseDto register(RegisterRequestDto registerRequestDto);
    LoginResponseDto login(LoginRequestDto loginRequestDto);
}
