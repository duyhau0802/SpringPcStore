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
        System.out.println("=== LOGIN REQUEST DEBUG ===");
        System.out.println("UsernameOrEmail: " + request.getUsernameOrEmail());
        System.out.println("Password provided: " + (request.getPassword() != null ? "YES" : "NO"));
        
        try {
            AuthResponse response = authService.login(request);
            System.out.println("Login successful for user: " + request.getUsernameOrEmail());
            System.out.println("=== END LOGIN DEBUG ===");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Login failed: " + e.getMessage());
            e.printStackTrace();
            System.out.println("=== END LOGIN DEBUG ===");
            throw e;
        }
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
