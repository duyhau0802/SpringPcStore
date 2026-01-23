package com.ecom.SpringPcStore.security;

import com.ecom.SpringPcStore.dto.response.ReviewResponse;
import com.ecom.SpringPcStore.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("reviewSecurity")
@RequiredArgsConstructor
public class ReviewSecurity {

    private final ReviewService reviewService;

    public boolean isReviewOwner(Long reviewId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        try {
            ReviewResponse review = reviewService.getReviewById(reviewId);
            String currentUsername = authentication.getName();
            
            return review.getUser() != null && 
                   review.getUser().getUsername().equals(currentUsername);
        } catch (Exception e) {
            return false;
        }
    }
}
