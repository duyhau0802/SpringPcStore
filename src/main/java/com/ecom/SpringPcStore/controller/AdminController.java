package com.ecom.SpringPcStore.controller;

import com.ecom.SpringPcStore.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/create-admin")
    public ResponseEntity<String> createAdmin(
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String fullName) {
        try {
            adminService.createAdminUser(username, email, password, fullName);
            return ResponseEntity.ok("Admin user created successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/assign-admin/{userId}")
    public ResponseEntity<String> assignAdminRole(@PathVariable Long userId) {
        try {
            adminService.assignAdminRole(userId);
            return ResponseEntity.ok("Admin role assigned to user " + userId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
