package com.ecom.SpringPcStore.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
public class DebugController {

    @GetMapping("/current-user")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(Map.of("status", "No authentication found"));
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("name", authentication.getName());
        response.put("authorities", authentication.getAuthorities());
        response.put("principal", authentication.getPrincipal());
        response.put("details", authentication.getDetails());
        response.put("isAuthenticated", authentication.isAuthenticated());
        response.put("class", authentication.getClass().getSimpleName());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user-roles")
    public ResponseEntity<String> checkUserRoles(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok("No authentication");
        }
        
        return ResponseEntity.ok("User authorities: " + authentication.getAuthorities().toString());
    }
}
