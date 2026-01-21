package com.ecom.SpringPcStore.controller;

import com.ecom.SpringPcStore.dto.request.LoginRequestDto;
import com.ecom.SpringPcStore.dto.request.RegisterRequestDto;
import com.ecom.SpringPcStore.dto.response.LoginResponseDto;
import com.ecom.SpringPcStore.dto.response.RegisterResponseDto;
import com.ecom.SpringPcStore.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> register(@Valid @RequestBody RegisterRequestDto registerRequestDto) {
        RegisterResponseDto response = authenticationService.register(registerRequestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        LoginResponseDto response = authenticationService.login(loginRequestDto);
        return ResponseEntity.ok(response);
    }
}
