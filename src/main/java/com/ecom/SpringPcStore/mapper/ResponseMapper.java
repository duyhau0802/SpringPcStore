package com.ecom.SpringPcStore.mapper;

import com.ecom.SpringPcStore.dto.response.*;
import com.ecom.SpringPcStore.entity.*;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ResponseMapper {

    // User mappings
    public static UserResponseDto toUserResponseDto(User user) {
        if (user == null) return null;
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    // Store mappings
    public static StoreResponseDto toStoreResponseDto(Store store) {
        if (store == null) return null;
        StoreResponseDto dto = new StoreResponseDto();
        dto.setId(store.getId());
        dto.setName(store.getName());
        dto.setDescription(store.getDescription());
        dto.setStatus(store.getStatus());
        dto.setCreatedAt(store.getCreatedAt());
        dto.setOwner(toUserResponseDto(store.getOwner()));
        return dto;
    }

    // Category mappings
    public static CategoryResponseDto toCategoryResponseDto(Category category) {
        if (category == null) return null;
        CategoryResponseDto dto = new CategoryResponseDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setParentCategory(toCategoryResponseDto(category.getParentCategory()));
        return dto;
    }

    // Brand mappings
    public static BrandResponseDto toBrandResponseDto(Brand brand) {
        if (brand == null) return null;
        BrandResponseDto dto = new BrandResponseDto();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        return dto;
    }

    // Product mappings
    public static ProductResponseDto toProductResponseDto(Product product) {
        if (product == null) return null;
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setStatus(product.getStatus());
        dto.setDescription(product.getDescription());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setStore(toStoreResponseDto(product.getStore()));
        dto.setCategory(toCategoryResponseDto(product.getCategory()));
        dto.setBrand(toBrandResponseDto(product.getBrand()));
        
        // Map collections
        if (product.getProductImages() != null) {
            dto.setProductImages(product.getProductImages().stream()
                    .map(ResponseMapper::toProductImageResponseDto)
                    .collect(Collectors.toList()));
        }
        
        if (product.getProductSpecs() != null) {
            dto.setProductSpecs(product.getProductSpecs().stream()
                    .map(ResponseMapper::toProductSpecResponseDto)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }

    public static ProductImageResponseDto toProductImageResponseDto(ProductImage productImage) {
        if (productImage == null) return null;
        ProductImageResponseDto dto = new ProductImageResponseDto();
        dto.setId(productImage.getId());
        dto.setImageUrl(productImage.getImageUrl());
        dto.setIsMain(productImage.getIsMain());
        return dto;
    }

    public static ProductSpecResponseDto toProductSpecResponseDto(ProductSpec productSpec) {
        if (productSpec == null) return null;
        ProductSpecResponseDto dto = new ProductSpecResponseDto();
        dto.setId(productSpec.getId());
        dto.setSpecKey(productSpec.getSpecKey());
        dto.setSpecValue(productSpec.getSpecValue());
        return dto;
    }

    // Order mappings
    public static OrderResponseDto toOrderResponseDto(Order order) {
        if (order == null) return null;
        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(order.getId());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setStatus(order.getStatus());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUser(toUserResponseDto(order.getUser()));
        
        if (order.getOrderItems() != null) {
            dto.setOrderItems(order.getOrderItems().stream()
                    .map(ResponseMapper::toOrderItemResponseDto)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }

    public static OrderItemResponseDto toOrderItemResponseDto(OrderItem orderItem) {
        if (orderItem == null) return null;
        OrderItemResponseDto dto = new OrderItemResponseDto();
        dto.setId(orderItem.getId());
        dto.setPrice(orderItem.getPrice());
        dto.setQuantity(orderItem.getQuantity());
        dto.setProduct(toProductResponseDto(orderItem.getProduct()));
        dto.setStore(toStoreResponseDto(orderItem.getStore()));
        return dto;
    }

    // Cart mappings
    public static CartResponseDto toCartResponseDto(Cart cart) {
        if (cart == null) return null;
        CartResponseDto dto = new CartResponseDto();
        dto.setId(cart.getId());
        dto.setCreatedAt(cart.getCreatedAt());
        dto.setUser(toUserResponseDto(cart.getUser()));
        
        if (cart.getCartItems() != null) {
            dto.setCartItems(cart.getCartItems().stream()
                    .map(ResponseMapper::toCartItemResponseDto)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }

    public static CartItemResponseDto toCartItemResponseDto(CartItem cartItem) {
        if (cartItem == null) return null;
        CartItemResponseDto dto = new CartItemResponseDto();
        dto.setId(cartItem.getId());
        dto.setQuantity(cartItem.getQuantity());
        dto.setPrice(cartItem.getPrice());
        dto.setProduct(toProductResponseDto(cartItem.getProduct()));
        dto.setStore(toStoreResponseDto(cartItem.getStore()));
        return dto;
    }

    // Review mappings
    public static ReviewResponseDto toReviewResponseDto(Review review) {
        if (review == null) return null;
        ReviewResponseDto dto = new ReviewResponseDto();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUser(toUserResponseDto(review.getUser()));
        dto.setProduct(toProductResponseDto(review.getProduct()));
        return dto;
    }
}
