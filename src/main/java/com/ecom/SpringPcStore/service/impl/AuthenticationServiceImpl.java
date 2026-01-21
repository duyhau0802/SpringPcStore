package com.ecom.SpringPcStore.service.impl;

import com.ecom.SpringPcStore.dto.request.LoginRequestDto;
import com.ecom.SpringPcStore.dto.request.RegisterRequestDto;
import com.ecom.SpringPcStore.dto.response.LoginResponseDto;
import com.ecom.SpringPcStore.dto.response.RegisterResponseDto;
import com.ecom.SpringPcStore.dto.response.UserResponseDto;
import com.ecom.SpringPcStore.entity.Role;
import com.ecom.SpringPcStore.entity.User;
import com.ecom.SpringPcStore.entity.UserRole;
import com.ecom.SpringPcStore.repository.RoleRepository;
import com.ecom.SpringPcStore.repository.UserRepository;
import com.ecom.SpringPcStore.service.AuthenticationService;
import com.ecom.SpringPcStore.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public RegisterResponseDto register(RegisterRequestDto registerRequestDto) {
        if (userRepository.existsByEmail(registerRequestDto.getEmail())) {
            throw new RuntimeException("Email is already taken");
        }

        if (userRepository.existsByUsername(registerRequestDto.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        User user = new User();
        user.setUsername(registerRequestDto.getUsername());
        user.setEmail(registerRequestDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequestDto.getPassword()));
        user.setFullName(registerRequestDto.getFullName());
        user.setPhoneNumber(registerRequestDto.getPhoneNumber());
        user.setStatus("ACTIVE");
        user.setCreatedAt(LocalDateTime.now());

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Role USER not found"));

        UserRole userRoleMapping = new UserRole();
        userRoleMapping.setUser(user);
        userRoleMapping.setRole(userRole);

        user.setUserRoles(Collections.singleton(userRoleMapping));

        User savedUser = userRepository.save(user);

        UserResponseDto userResponseDto = new UserResponseDto();
        userResponseDto.setId(savedUser.getId());
        userResponseDto.setUsername(savedUser.getUsername());
        userResponseDto.setEmail(savedUser.getEmail());
        userResponseDto.setFullName(savedUser.getFullName());
        userResponseDto.setPhoneNumber(savedUser.getPhoneNumber());
        userResponseDto.setStatus(savedUser.getStatus());
        userResponseDto.setCreatedAt(savedUser.getCreatedAt());

        RegisterResponseDto response = new RegisterResponseDto();
        response.setMessage("User registered successfully");
        response.setUser(userResponseDto);

        return response;
    }

    @Override
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.getEmail(),
                        loginRequestDto.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken(authentication.getName());

        User user = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponseDto userResponseDto = new UserResponseDto();
        userResponseDto.setId(user.getId());
        userResponseDto.setUsername(user.getUsername());
        userResponseDto.setEmail(user.getEmail());
        userResponseDto.setFullName(user.getFullName());
        userResponseDto.setPhoneNumber(user.getPhoneNumber());
        userResponseDto.setStatus(user.getStatus());
        userResponseDto.setCreatedAt(user.getCreatedAt());

        LoginResponseDto response = new LoginResponseDto();
        response.setToken(jwt);
        response.setUser(userResponseDto);

        return response;
    }
}
