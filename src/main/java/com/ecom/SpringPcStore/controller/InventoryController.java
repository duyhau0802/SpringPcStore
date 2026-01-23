package com.ecom.SpringPcStore.controller;

import com.ecom.SpringPcStore.dto.request.InventoryRequest;
import com.ecom.SpringPcStore.dto.response.InventoryResponse;
import com.ecom.SpringPcStore.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STORE_OWNER')")
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {
        List<InventoryResponse> inventory = inventoryService.getAllInventory();
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STORE_OWNER')")
    public ResponseEntity<InventoryResponse> getInventoryById(@PathVariable Long id) {
        InventoryResponse inventory = inventoryService.getInventoryById(id);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/store/{storeId}/product/{productId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STORE_OWNER')")
    public ResponseEntity<InventoryResponse> getInventoryByStoreAndProduct(
            @PathVariable Long storeId, 
            @PathVariable Long productId) {
        InventoryResponse inventory = inventoryService.getInventoryByStoreAndProduct(storeId, productId);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/store/{storeId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STORE_OWNER')")
    public ResponseEntity<List<InventoryResponse>> getInventoryByStore(@PathVariable Long storeId) {
        List<InventoryResponse> inventory = inventoryService.getInventoryByStore(storeId);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/product/{productId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STORE_OWNER')")
    public ResponseEntity<List<InventoryResponse>> getInventoryByProduct(@PathVariable Long productId) {
        List<InventoryResponse> inventory = inventoryService.getInventoryByProduct(productId);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STORE_OWNER')")
    public ResponseEntity<List<InventoryResponse>> getLowStockInventory(
            @RequestParam(defaultValue = "10") Integer threshold) {
        List<InventoryResponse> inventory = inventoryService.getLowStockInventory(threshold);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/out-of-stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STORE_OWNER')")
    public ResponseEntity<List<InventoryResponse>> getOutOfStockInventory() {
        List<InventoryResponse> inventory = inventoryService.getOutOfStockInventory();
        return ResponseEntity.ok(inventory);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STORE_OWNER')")
    public ResponseEntity<InventoryResponse> createInventory(@Valid @RequestBody InventoryRequest request) {
        InventoryResponse createdInventory = inventoryService.createInventory(request);
        return ResponseEntity.ok(createdInventory);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STORE_OWNER')")
    public ResponseEntity<InventoryResponse> updateInventory(
            @PathVariable Long id, 
            @Valid @RequestBody InventoryRequest request) {
        InventoryResponse updatedInventory = inventoryService.updateInventory(id, request);
        return ResponseEntity.ok(updatedInventory);
    }

    @PutMapping("/{id}/quantity")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STORE_OWNER')")
    public ResponseEntity<InventoryResponse> updateInventoryQuantity(
            @PathVariable Long id, 
            @RequestParam Integer quantity) {
        InventoryResponse updatedInventory = inventoryService.updateInventoryQuantity(id, quantity);
        return ResponseEntity.ok(updatedInventory);
    }

    @PutMapping("/{id}/add-stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STORE_OWNER')")
    public ResponseEntity<InventoryResponse> addStock(
            @PathVariable Long id, 
            @RequestParam Integer quantity) {
        InventoryResponse updatedInventory = inventoryService.addStock(id, quantity);
        return ResponseEntity.ok(updatedInventory);
    }

    @PutMapping("/{id}/remove-stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STORE_OWNER')")
    public ResponseEntity<InventoryResponse> removeStock(
            @PathVariable Long id, 
            @RequestParam Integer quantity) {
        InventoryResponse updatedInventory = inventoryService.removeStock(id, quantity);
        return ResponseEntity.ok(updatedInventory);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STORE_OWNER')")
    public ResponseEntity<Map<String, Object>> deleteInventory(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Inventory deleted successfully");
        response.put("deletedInventoryId", id);
        
        return ResponseEntity.ok(response);
    }
}
