package com.ecom.SpringPcStore.dto.request;

import lombok.Data;

@Data
public class ProductImageRequestDto {
    private String imageUrl;
    private Boolean isMain;
}
