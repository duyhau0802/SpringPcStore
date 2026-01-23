package com.ecom.SpringPcStore.service;

import com.ecom.SpringPcStore.dto.request.InventoryRequest;
import com.ecom.SpringPcStore.dto.response.InventoryResponse;
import com.ecom.SpringPcStore.entity.*;
import com.ecom.SpringPcStore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final ProductImageRepository productImageRepository;

    public List<InventoryResponse> getAllInventory() {
        return inventoryRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public InventoryResponse getInventoryById(Long id) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));
        return convertToResponse(inventory);
    }

    public InventoryResponse getInventoryByStoreAndProduct(Long storeId, Long productId) {
        Inventory inventory = inventoryRepository.findByStoreIdAndProductId(storeId, productId)
                .orElseThrow(() -> new RuntimeException("Inventory not found for store " + storeId + " and product " + productId));
        return convertToResponse(inventory);
    }

    public List<InventoryResponse> getInventoryByStore(Long storeId) {
        return inventoryRepository.findByStoreId(storeId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<InventoryResponse> getInventoryByProduct(Long productId) {
        return inventoryRepository.findByProductId(productId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<InventoryResponse> getLowStockInventory(Integer threshold) {
        return inventoryRepository.findByQuantityLessThan(threshold).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<InventoryResponse> getOutOfStockInventory() {
        return inventoryRepository.findByQuantity(0).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public InventoryResponse createInventory(InventoryRequest request) {
        // Validate store and product exist
        storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + request.getStoreId()));
        
        productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        // Check if inventory already exists
        Optional<Inventory> existingInventory = inventoryRepository.findByStoreIdAndProductId(
                request.getStoreId(), request.getProductId());
        
        if (existingInventory.isPresent()) {
            throw new RuntimeException("Inventory already exists for this store and product combination");
        }

        Inventory inventory = new Inventory();
        inventory.setStoreId(request.getStoreId());
        inventory.setProductId(request.getProductId());
        inventory.setQuantity(request.getQuantity());
        inventory.setUpdatedAt(LocalDateTime.now());

        Inventory savedInventory = inventoryRepository.save(inventory);
        return convertToResponse(savedInventory);
    }

    public InventoryResponse updateInventory(Long id, InventoryRequest request) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));

        // Validate store and product exist
        storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + request.getStoreId()));
        
        productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        inventory.setStoreId(request.getStoreId());
        inventory.setProductId(request.getProductId());
        inventory.setQuantity(request.getQuantity());
        inventory.setUpdatedAt(LocalDateTime.now());

        Inventory updatedInventory = inventoryRepository.save(inventory);
        return convertToResponse(updatedInventory);
    }

    public InventoryResponse updateInventoryQuantity(Long id, Integer quantity) {
        if (quantity < 0) {
            throw new RuntimeException("Quantity cannot be negative");
        }

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));

        inventory.setQuantity(quantity);
        inventory.setUpdatedAt(LocalDateTime.now());

        Inventory updatedInventory = inventoryRepository.save(inventory);
        return convertToResponse(updatedInventory);
    }

    public InventoryResponse addStock(Long id, Integer quantity) {
        if (quantity <= 0) {
            throw new RuntimeException("Quantity to add must be positive");
        }

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));

        inventory.setQuantity(inventory.getQuantity() + quantity);
        inventory.setUpdatedAt(LocalDateTime.now());

        Inventory updatedInventory = inventoryRepository.save(inventory);
        return convertToResponse(updatedInventory);
    }

    public InventoryResponse removeStock(Long id, Integer quantity) {
        if (quantity <= 0) {
            throw new RuntimeException("Quantity to remove must be positive");
        }

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));

        if (inventory.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock. Current quantity: " + inventory.getQuantity() + ", requested to remove: " + quantity);
        }

        inventory.setQuantity(inventory.getQuantity() - quantity);
        inventory.setUpdatedAt(LocalDateTime.now());

        Inventory updatedInventory = inventoryRepository.save(inventory);
        return convertToResponse(updatedInventory);
    }

    public void deleteInventory(Long id) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));
        inventoryRepository.delete(inventory);
    }

    private InventoryResponse convertToResponse(Inventory inventory) {
        InventoryResponse response = new InventoryResponse();
        response.setId(inventory.getId());
        response.setStoreId(inventory.getStoreId());
        response.setProductId(inventory.getProductId());
        response.setQuantity(inventory.getQuantity());
        response.setUpdatedAt(inventory.getUpdatedAt());

        // Product info
        if (inventory.getProduct() != null) {
            InventoryResponse.ProductResponse productResponse = new InventoryResponse.ProductResponse();
            productResponse.setId(inventory.getProduct().getId());
            productResponse.setName(inventory.getProduct().getName());
            productResponse.setStatus(inventory.getProduct().getStatus());
            
            // Get main image
            List<ProductImage> images = productImageRepository.findByProductId(inventory.getProductId());
            if (!images.isEmpty()) {
                productResponse.setImageUrl(images.get(0).getImageUrl());
            }
            
            response.setProduct(productResponse);
        }

        // Store info
        if (inventory.getStore() != null) {
            InventoryResponse.StoreResponse storeResponse = new InventoryResponse.StoreResponse();
            storeResponse.setId(inventory.getStore().getId());
            storeResponse.setName(inventory.getStore().getName());
            response.setStore(storeResponse);
        }

        return response;
    }
}
