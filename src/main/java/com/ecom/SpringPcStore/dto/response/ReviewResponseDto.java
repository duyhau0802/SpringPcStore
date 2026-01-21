package com.ecom.SpringPcStore.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewResponseDto {
    private Long id;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private UserResponseDto user;
    private ProductResponseDto product;
}
