package com.ecom.SpringPcStore.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSpecRequest {
    
    private String specKey;
    
    private String specValue;
}
