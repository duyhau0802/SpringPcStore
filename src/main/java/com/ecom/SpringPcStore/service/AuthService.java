package com.ecom.SpringPcStore.service;

import com.ecom.SpringPcStore.dto.request.LoginRequest;
import com.ecom.SpringPcStore.dto.request.RegisterRequest;
import com.ecom.SpringPcStore.dto.response.AuthResponse;
import com.ecom.SpringPcStore.entity.Role;
import com.ecom.SpringPcStore.entity.User;
import com.ecom.SpringPcStore.entity.UserRole;
import com.ecom.SpringPcStore.repository.RoleRepository;
import com.ecom.SpringPcStore.repository.UserRepository;
import com.ecom.SpringPcStore.repository.UserRoleRepository;
import com.ecom.SpringPcStore.security.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public void register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setStatus("ACTIVE");

        userRepository.save(user);

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));

        UserRole ur = new UserRole(user, userRole);
        userRoleRepository.save(ur);
    }

    public AuthResponse login(LoginRequest request) {
        System.out.println("=== AUTH SERVICE LOGIN DEBUG ===");
        System.out.println("Login identifier: " + request.getUsernameOrEmail());
        System.out.println("Password provided: " + (request.getPassword() != null && !request.getPassword().isEmpty() ? "YES" : "NO"));
        
        User user;
        String loginIdentifier = request.getUsernameOrEmail();
        
        // Try to find user by username first, then by email
        if (loginIdentifier.contains("@")) {
            // Login with email
            System.out.println("Attempting login with email: " + loginIdentifier);
            user = userRepository.findByEmail(loginIdentifier)
                    .orElseThrow(() -> {
                        System.out.println("User not found with email: " + loginIdentifier);
                        return new RuntimeException("Invalid credentials");
                    });
        } else {
            // Login with username
            System.out.println("Attempting login with username: " + loginIdentifier);
            user = userRepository.findByUsername(loginIdentifier)
                    .orElseThrow(() -> {
                        System.out.println("User not found with username: " + loginIdentifier);
                        return new RuntimeException("Invalid credentials");
                    });
        }

        System.out.println("Found user: " + user.getUsername() + " (ID: " + user.getId() + ")");
        System.out.println("User status: " + user.getStatus());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            System.out.println("Password mismatch for user: " + user.getUsername());
            throw new RuntimeException("Invalid credentials");
        }

        System.out.println("Password match successful for user: " + user.getUsername());
        
        String token = jwtService.generateToken(user);
        System.out.println("JWT token generated successfully");
        
        // Extract roles from user
        Set<String> roles = user.getUserRoles().stream()
                .map(userRole -> userRole.getRole().getName())
                .collect(Collectors.toSet());
        
        System.out.println("User roles: " + roles);
        System.out.println("=== END AUTH SERVICE DEBUG ===");
        
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), roles);
    }
}
