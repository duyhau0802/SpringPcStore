package com.ecom.SpringPcStore.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    
    @NotNull(message = "Store ID is required")
    private Long storeId;
    
    @NotNull(message = "Category ID is required")
    private Long categoryId;
    
    @NotNull(message = "Brand ID is required")
    private Long brandId;
    
    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 255, message = "Product name must be between 2 and 255 characters")
    private String name;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Price must have maximum 10 integer and 2 decimal digits")
    private BigDecimal price;
    
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(ACTIVE|INACTIVE|OUT_OF_STOCK)$", message = "Status must be ACTIVE, INACTIVE, or OUT_OF_STOCK")
    private String status;
    
    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;
    
    private List<ProductImageRequest> productImages;
    
    private List<ProductSpecRequest> productSpecs;
}
