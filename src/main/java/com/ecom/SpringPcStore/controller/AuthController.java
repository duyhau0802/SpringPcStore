package com.ecom.SpringPcStore.controller;

import com.ecom.SpringPcStore.dto.request.LoginRequest;
import com.ecom.SpringPcStore.dto.request.RegisterRequest;
import com.ecom.SpringPcStore.dto.response.AuthResponse;
import com.ecom.SpringPcStore.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // =======================
    // LOGIN
    // =======================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // =======================
    // REGISTER
    // =======================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("Register successfully");
    }
}
