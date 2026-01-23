package com.ecom.SpringPcStore.repository;

import com.ecom.SpringPcStore.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    
    Optional<Inventory> findByProductId(Long productId);
    Optional<Inventory> findByStoreIdAndProductId(Long storeId, Long productId);
    void deleteByProductId(Long productId);
    List<Inventory> findByStoreId(Long storeId);
    List<Inventory> findByQuantityLessThan(Integer threshold);
    List<Inventory> findByQuantity(Integer quantity);
    
    @Query("SELECT i FROM Inventory i WHERE i.productId = :productId AND i.quantity > 0")
    Optional<Inventory> findAvailableByProductId(@Param("productId") Long productId);
}
