package com.ecom.SpringPcStore.security;

import com.ecom.SpringPcStore.entity.User;
import com.ecom.SpringPcStore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("userSecurity")
@RequiredArgsConstructor
public class UserSecurity {

    private final UserRepository userRepository;

    public boolean isCurrentUser(Long userId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String currentUsername = authentication.getName();
        User user = userRepository.findById(userId).orElse(null);
        
        return user != null && user.getUsername().equals(currentUsername);
    }

    public boolean isCurrentUser(String username, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String currentUsername = authentication.getName();
        return currentUsername.equals(username);
    }
}
