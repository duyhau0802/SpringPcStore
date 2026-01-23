package com.ecom.SpringPcStore.controller;

import com.ecom.SpringPcStore.dto.request.ReviewRequest;
import com.ecom.SpringPcStore.dto.response.ReviewResponse;
import com.ecom.SpringPcStore.service.ReviewService;
import com.ecom.SpringPcStore.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ReviewResponse>> getAllReviews(Pageable pageable) {
        Page<ReviewResponse> reviews = reviewService.getAllReviews(pageable);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @reviewSecurity.isReviewOwner(#id, authentication)")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable Long id) {
        ReviewResponse review = reviewService.getReviewById(id);
        return ResponseEntity.ok(review);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByProductId(
            @PathVariable Long productId, 
            Pageable pageable) {
        Page<ReviewResponse> reviews = reviewService.getReviewsByProductId(productId, pageable);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/product/{productId}/details")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProductIdWithDetails(@PathVariable Long productId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByProductIdWithDetails(productId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/product/{productId}/average")
    public ResponseEntity<Map<String, Object>> getProductRatingStats(@PathVariable Long productId) {
        Double averageRating = reviewService.getAverageRatingByProductId(productId);
        Long reviewCount = reviewService.getReviewCountByProductId(productId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("productId", productId);
        response.put("averageRating", averageRating != null ? averageRating : 0.0);
        response.put("reviewCount", reviewCount != null ? reviewCount : 0);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<ReviewResponse>> getMyReviews(Pageable pageable, Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        Page<ReviewResponse> reviews = reviewService.getReviewsByUserId(userId, pageable);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewRequest request, 
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        ReviewResponse review = reviewService.createReview(request, userId);
        return ResponseEntity.ok(review);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated() and @reviewSecurity.isReviewOwner(#id, authentication)")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long id, 
            @Valid @RequestBody ReviewRequest request, 
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        ReviewResponse review = reviewService.updateReview(id, request, userId);
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated() and @reviewSecurity.isReviewOwner(#id, authentication)")
    public ResponseEntity<Map<String, Object>> deleteReview(
            @PathVariable Long id, 
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        reviewService.deleteReview(id, userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Review deleted successfully");
        response.put("deletedReviewId", id);
        
        return ResponseEntity.ok(response);
    }

    private Long getCurrentUserId(Authentication authentication) {
        String username = authentication.getName();
        return userService.getUserIdByUsername(username);
    }
}
