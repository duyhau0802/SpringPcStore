package com.ecom.SpringPcStore.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class CategoryResponseDto {
    private Long id;
    private String name;
    private CategoryResponseDto parentCategory;
    private List<CategoryResponseDto> subCategories;
}
