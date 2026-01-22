package com.ecom.SpringPcStore.service;

import com.ecom.SpringPcStore.entity.Role;
import com.ecom.SpringPcStore.entity.User;
import com.ecom.SpringPcStore.entity.UserRole;
import com.ecom.SpringPcStore.repository.RoleRepository;
import com.ecom.SpringPcStore.repository.UserRepository;
import com.ecom.SpringPcStore.repository.UserRoleRepository;
import com.ecom.SpringPcStore.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    public void createAdminUser(String username, String email, String password, String fullName) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        User admin = new User();
        admin.setUsername(username);
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setFullName(fullName);
        admin.setStatus("ACTIVE");

        userRepository.save(admin);

        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

        UserRole userRole = new UserRole(admin, adminRole);
        userRoleRepository.save(userRole);
    }

    public void assignAdminRole(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

        // Check if user already has ADMIN role
        boolean hasAdminRole = user.getUserRoles().stream()
                .anyMatch(ur -> ur.getRole().getName().equals("ADMIN"));

        if (!hasAdminRole) {
            UserRole userRole = new UserRole(user, adminRole);
            userRoleRepository.save(userRole);
        }
    }
}
