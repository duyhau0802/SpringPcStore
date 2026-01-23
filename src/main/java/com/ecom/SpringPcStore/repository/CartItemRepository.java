package com.ecom.SpringPcStore.repository;

import com.ecom.SpringPcStore.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    List<CartItem> findByCartId(Long cartId);
    Optional<CartItem> findByCartIdAndProductIdAndStoreId(Long cartId, Long productId, Long storeId);
    
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.cartId = :cartId")
    void deleteByCartId(@Param("cartId") Long cartId);
    
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.cartId = :cartId AND ci.productId = :productId AND ci.storeId = :storeId")
    void deleteByCartIdAndProductIdAndStoreId(@Param("cartId") Long cartId, @Param("productId") Long productId, @Param("storeId") Long storeId);
}
