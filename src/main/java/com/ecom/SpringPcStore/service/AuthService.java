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
        user.setStatus("ACTIVE");

        userRepository.save(user);

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));

        UserRole ur = new UserRole(user, userRole);
        userRoleRepository.save(ur);
    }

    public AuthResponse login(LoginRequest request) {

        User user;
        String loginIdentifier = request.getUsernameOrEmail();
        
        // Try to find user by username first, then by email
        if (loginIdentifier.contains("@")) {
            // Login with email
            user = userRepository.findByEmail(loginIdentifier)
                    .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        } else {
            // Login with username
            user = userRepository.findByUsername(loginIdentifier)
                    .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);
        
        // Extract roles from user
        Set<String> roles = user.getUserRoles().stream()
                .map(userRole -> userRole.getRole().getName())
                .collect(Collectors.toSet());
        
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), roles);
    }
}
