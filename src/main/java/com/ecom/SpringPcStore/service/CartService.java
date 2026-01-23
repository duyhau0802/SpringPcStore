package com.ecom.SpringPcStore.service;

import com.ecom.SpringPcStore.dto.request.CartItemRequest;
import com.ecom.SpringPcStore.dto.response.CartResponse;
import com.ecom.SpringPcStore.entity.*;
import com.ecom.SpringPcStore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final InventoryRepository inventoryRepository;
    private final ProductImageRepository productImageRepository;

    public CartResponse getCartByUserId(Long userId) {
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> createNewCart(userId));
        return convertToResponse(cart);
    }

    public CartResponse addItemToCart(Long userId, CartItemRequest request) {
        // Validate product exists and is available
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        if (!"ACTIVE".equals(product.getStatus())) {
            throw new RuntimeException("Product is not available");
        }

        // Check inventory availability
        Optional<Inventory> inventoryOpt = inventoryRepository.findAvailableByProductId(request.getProductId());
        if (inventoryOpt.isEmpty() || inventoryOpt.get().getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Product is out of stock or insufficient quantity");
        }

        // Get or create cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));

        // Check if item already exists in cart
        Optional<CartItem> existingItemOpt = cartItemRepository
                .findByCartIdAndProductIdAndStoreId(cart.getId(), request.getProductId(), request.getStoreId());

        CartItem cartItem;
        if (existingItemOpt.isPresent()) {
            // Update quantity
            cartItem = existingItemOpt.get();
            int newQuantity = cartItem.getQuantity() + request.getQuantity();
            
            // Check inventory again
            if (inventoryOpt.get().getQuantity() < newQuantity) {
                throw new RuntimeException("Insufficient stock for requested quantity");
            }
            
            cartItem.setQuantity(newQuantity);
        } else {
            // Create new cart item
            cartItem = new CartItem();
            cartItem.setCartId(cart.getId());
            cartItem.setProductId(request.getProductId());
            cartItem.setStoreId(request.getStoreId());
            cartItem.setQuantity(request.getQuantity());
            cartItem.setPrice(request.getPrice());
        }

        cartItemRepository.save(cartItem);
        
        // Return updated cart
        Cart updatedCart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        return convertToResponse(updatedCart);
    }

    public CartResponse updateCartItemQuantity(Long userId, Long cartItemId, Integer quantity) {
        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be positive");
        }

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Verify cart belongs to user
        Cart cart = cartRepository.findById(cartItem.getCartId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        if (!cart.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to cart item");
        }

        // Check inventory availability
        Optional<Inventory> inventoryOpt = inventoryRepository.findAvailableByProductId(cartItem.getProductId());
        if (inventoryOpt.isEmpty() || inventoryOpt.get().getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock for requested quantity");
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        Cart updatedCart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        return convertToResponse(updatedCart);
    }

    public CartResponse removeItemFromCart(Long userId, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Verify cart belongs to user
        Cart cart = cartRepository.findById(cartItem.getCartId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        if (!cart.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to cart item");
        }

        cartItemRepository.delete(cartItem);

        Cart updatedCart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        return convertToResponse(updatedCart);
    }

    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElse(null); // Don't throw if cart doesn't exist
        
        if (cart != null) {
            cartItemRepository.deleteByCartId(cart.getId());
        }
        // If cart doesn't exist, nothing to clear - silently succeed
    }

    private Cart createNewCart(Long userId) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setCartItems(new ArrayList<>()); // Initialize empty list
        return cartRepository.save(cart);
    }

    private CartResponse convertToResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setUserId(cart.getUserId());
        response.setCreatedAt(cart.getCreatedAt());

        // Convert cart items
        List<CartResponse.CartItemResponse> itemResponses = cart.getCartItems().stream()
                .map(this::convertCartItemToResponse)
                .collect(Collectors.toList());
        
        response.setCartItems(itemResponses);

        // Calculate totals
        BigDecimal totalPrice = itemResponses.stream()
                .map(CartResponse.CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Integer totalItems = itemResponses.stream()
                .mapToInt(CartResponse.CartItemResponse::getQuantity)
                .sum();

        response.setTotalPrice(totalPrice);
        response.setTotalItems(totalItems);

        return response;
    }

    private CartResponse.CartItemResponse convertCartItemToResponse(CartItem cartItem) {
        CartResponse.CartItemResponse response = new CartResponse.CartItemResponse();
        response.setId(cartItem.getId());
        response.setCartId(cartItem.getCartId());
        response.setProductId(cartItem.getProductId());
        response.setStoreId(cartItem.getStoreId());
        response.setQuantity(cartItem.getQuantity());
        response.setPrice(cartItem.getPrice());
        
        // Calculate subtotal
        BigDecimal subtotal = cartItem.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
        response.setSubtotal(subtotal);

        // Get product info
        Product product = productRepository.findById(cartItem.getProductId()).orElse(null);
        if (product != null) {
            CartResponse.CartItemResponse.ProductResponse productResponse = new CartResponse.CartItemResponse.ProductResponse();
            productResponse.setId(product.getId());
            productResponse.setName(product.getName());
            productResponse.setStatus(product.getStatus());
            
            // Get main image
            List<ProductImage> images = productImageRepository.findByProductId(product.getId());
            if (!images.isEmpty()) {
                productResponse.setImageUrl(images.get(0).getImageUrl());
            }
            
            response.setProduct(productResponse);
        }

        // Get store info
        Store store = storeRepository.findById(cartItem.getStoreId()).orElse(null);
        if (store != null) {
            CartResponse.CartItemResponse.StoreResponse storeResponse = new CartResponse.CartItemResponse.StoreResponse();
            storeResponse.setId(store.getId());
            storeResponse.setName(store.getName());
            response.setStore(storeResponse);
        }

        return response;
    }
}
