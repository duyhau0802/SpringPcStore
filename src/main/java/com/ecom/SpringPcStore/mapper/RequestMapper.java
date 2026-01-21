package com.ecom.SpringPcStore.mapper;

import com.ecom.SpringPcStore.dto.request.*;
import com.ecom.SpringPcStore.entity.*;
import org.springframework.stereotype.Component;

@Component
public class RequestMapper {

    // User mappings
    public static User toUser(UserRequestDto dto) {
        if (dto == null) return null;
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());
        return user;
    }

    // Store mappings
    public static Store toStore(StoreRequestDto dto) {
        if (dto == null) return null;
        Store store = new Store();
        store.setName(dto.getName());
        store.setDescription(dto.getDescription());
        if (dto.getOwnerId() != null) {
            User owner = new User();
            owner.setId(dto.getOwnerId());
            store.setOwner(owner);
        }
        return store;
    }

    // Category mappings
    public static Category toCategory(CategoryRequestDto dto) {
        if (dto == null) return null;
        Category category = new Category();
        category.setName(dto.getName());
        if (dto.getParentCategoryId() != null) {
            Category parentCategory = new Category();
            parentCategory.setId(dto.getParentCategoryId());
            category.setParentCategory(parentCategory);
        }
        return category;
    }

    // Brand mappings
    public static Brand toBrand(BrandRequestDto dto) {
        if (dto == null) return null;
        Brand brand = new Brand();
        brand.setName(dto.getName());
        return brand;
    }

    // Product mappings
    public static Product toProduct(ProductRequestDto dto) {
        if (dto == null) return null;
        Product product = new Product();
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setStatus(dto.getStatus());
        product.setDescription(dto.getDescription());
        
        if (dto.getStoreId() != null) {
            Store store = new Store();
            store.setId(dto.getStoreId());
            product.setStore(store);
        }
        
        if (dto.getCategoryId() != null) {
            Category category = new Category();
            category.setId(dto.getCategoryId());
            product.setCategory(category);
        }
        
        if (dto.getBrandId() != null) {
            Brand brand = new Brand();
            brand.setId(dto.getBrandId());
            product.setBrand(brand);
        }
        
        return product;
    }

    public static ProductImage toProductImage(ProductImageRequestDto dto) {
        if (dto == null) return null;
        ProductImage productImage = new ProductImage();
        productImage.setImageUrl(dto.getImageUrl());
        productImage.setIsMain(dto.getIsMain());
        return productImage;
    }

    public static ProductSpec toProductSpec(ProductSpecRequestDto dto) {
        if (dto == null) return null;
        ProductSpec productSpec = new ProductSpec();
        productSpec.setSpecKey(dto.getSpecKey());
        productSpec.setSpecValue(dto.getSpecValue());
        return productSpec;
    }

    // Order mappings
    public static Order toOrder(OrderRequestDto dto) {
        if (dto == null) return null;
        Order order = new Order();
        order.setShippingAddress(dto.getShippingAddress());
        return order;
    }

    public static OrderItem toOrderItem(OrderItemRequestDto dto) {
        if (dto == null) return null;
        OrderItem orderItem = new OrderItem();
        orderItem.setPrice(dto.getPrice());
        orderItem.setQuantity(dto.getQuantity());
        
        if (dto.getProductId() != null) {
            Product product = new Product();
            product.setId(dto.getProductId());
            orderItem.setProduct(product);
        }
        
        return orderItem;
    }

    // Cart mappings
    public static Cart toCart(CartRequestDto dto) {
        if (dto == null) return null;
        return new Cart();
    }

    public static CartItem toCartItem(CartItemRequestDto dto) {
        if (dto == null) return null;
        CartItem cartItem = new CartItem();
        cartItem.setQuantity(dto.getQuantity());
        
        if (dto.getProductId() != null) {
            Product product = new Product();
            product.setId(dto.getProductId());
            cartItem.setProduct(product);
        }
        
        return cartItem;
    }

    // Review mappings
    public static Review toReview(ReviewRequestDto dto) {
        if (dto == null) return null;
        Review review = new Review();
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        
        if (dto.getProductId() != null) {
            Product product = new Product();
            product.setId(dto.getProductId());
            review.setProduct(product);
        }
        
        return review;
    }
}
