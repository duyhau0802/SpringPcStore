package com.ecom.SpringPcStore.dto.response;

import lombok.Data;

@Data
public class ProductImageResponseDto {
    private Long id;
    private String imageUrl;
    private Boolean isMain;
}
