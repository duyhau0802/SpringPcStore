package com.ecom.SpringPcStore.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageRequest {
    
    @NotBlank(message = "Image URL is required")
    private String imageUrl;
    
    private Boolean isMain = false;
}
