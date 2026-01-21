package com.ecom.SpringPcStore.dto.request;

import lombok.Data;

@Data
public class ReviewRequestDto {
    private Integer rating;
    private String comment;
    private Long productId;
}
