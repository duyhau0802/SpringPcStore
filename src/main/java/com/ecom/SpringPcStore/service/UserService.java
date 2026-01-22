package com.ecom.SpringPcStore.service;

import com.ecom.SpringPcStore.dto.request.UserUpdateRequest;
import com.ecom.SpringPcStore.dto.response.UserResponse;
import com.ecom.SpringPcStore.entity.User;
import com.ecom.SpringPcStore.repository.UserRepository;
import com.ecom.SpringPcStore.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;

    // =======================
    // USER DETAILS SERVICE (Spring Security)
    // =======================
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameWithRoles(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        
        // Extract roles from user's role assignments
        String[] roles = user.getUserRoles().stream()
                .map(userRole -> "ROLE_" + userRole.getRole().getName())
                .toArray(String[]::new);
        
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(roles)
                .build();
    }

    // =======================
    // USER CRUD OPERATIONS
    // =======================
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> {
                    // Initialize user roles to avoid lazy loading issues
                    user.getUserRoles().size();
                    return convertToResponse(user);
                })
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Initialize user roles to avoid lazy loading issues
        user.getUserRoles().size();
        
        return convertToResponse(user);
    }

    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Check if username is already taken by another user
        if (!user.getUsername().equals(request.getUsername()) && 
            userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email is already taken by another user
        if (!user.getEmail().equals(request.getEmail()) && 
            userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Update user fields
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setStatus(request.getStatus());

        User updatedUser = userRepository.save(user);
        return convertToResponse(updatedUser);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Delete user roles first to avoid foreign key constraint
        userRoleRepository.deleteByUserId(id);
        
        // Then delete user
        userRepository.delete(user);
    }

    // =======================
    // HELPER METHODS
    // =======================
    private UserResponse convertToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setStatus(user.getStatus());
        response.setCreatedAt(user.getCreatedAt());
        
        // Extract role names from UserRole relationships
        Set<String> roles = user.getUserRoles().stream()
                .map(userRole -> userRole.getRole().getName())
                .collect(Collectors.toSet());
        response.setRoles(roles);
        
        return response;
    }
}
