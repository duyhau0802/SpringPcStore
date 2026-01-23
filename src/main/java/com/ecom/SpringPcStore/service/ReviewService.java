package com.ecom.SpringPcStore.service;

import com.ecom.SpringPcStore.dto.request.ReviewRequest;
import com.ecom.SpringPcStore.dto.response.ReviewResponse;
import com.ecom.SpringPcStore.entity.*;
import com.ecom.SpringPcStore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductImageRepository productImageRepository;

    public Page<ReviewResponse> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    public ReviewResponse getReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
        return convertToResponse(review);
    }

    public Page<ReviewResponse> getReviewsByProductId(Long productId, Pageable pageable) {
        return reviewRepository.findByProductId(productId, pageable)
                .map(this::convertToResponse);
    }

    public Page<ReviewResponse> getReviewsByUserId(Long userId, Pageable pageable) {
        return reviewRepository.findByUserId(userId, pageable)
                .map(this::convertToResponse);
    }

    public List<ReviewResponse> getReviewsByProductIdWithDetails(Long productId) {
        return reviewRepository.findByProductIdWithDetails(productId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Double getAverageRatingByProductId(Long productId) {
        return reviewRepository.getAverageRatingByProductId(productId);
    }

    public Long getReviewCountByProductId(Long productId) {
        return reviewRepository.countByProductId(productId);
    }

    public ReviewResponse createReview(ReviewRequest request, Long userId) {
        // Validate product exists
        productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        // Validate user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Check if user already reviewed this product
        Optional<Review> existingReview = reviewRepository.findByProductIdAndUserId(
                request.getProductId(), userId);
        if (existingReview.isPresent()) {
            throw new RuntimeException("User has already reviewed this product");
        }

        // Create review
        Review review = new Review();
        review.setProductId(request.getProductId());
        review.setUserId(userId);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview = reviewRepository.save(review);
        return convertToResponse(savedReview);
    }

    public ReviewResponse updateReview(Long id, ReviewRequest request, Long userId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));

        // Check if review belongs to user
        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this review");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review updatedReview = reviewRepository.save(review);
        return convertToResponse(updatedReview);
    }

    public void deleteReview(Long id, Long userId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));

        // Check if review belongs to user
        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this review");
        }

        reviewRepository.delete(review);
    }

    private ReviewResponse convertToResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setProductId(review.getProductId());
        response.setUserId(review.getUserId());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt());

        // User info
        if (review.getUser() != null) {
            ReviewResponse.UserResponse userResponse = new ReviewResponse.UserResponse();
            userResponse.setId(review.getUser().getId());
            userResponse.setUsername(review.getUser().getUsername());
            userResponse.setFullName(review.getUser().getFullName());
            response.setUser(userResponse);
        }

        // Product info
        if (review.getProduct() != null) {
            ReviewResponse.ProductResponse productResponse = new ReviewResponse.ProductResponse();
            productResponse.setId(review.getProduct().getId());
            productResponse.setName(review.getProduct().getName());
            
            // Get main image
            List<ProductImage> images = productImageRepository.findByProductId(review.getProductId());
            if (!images.isEmpty()) {
                productResponse.setImageUrl(images.get(0).getImageUrl());
            }
            
            response.setProduct(productResponse);
        }

        return response;
    }
}
