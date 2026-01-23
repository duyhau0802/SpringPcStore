package com.ecom.SpringPcStore.repository;

import com.ecom.SpringPcStore.entity.StoreCommission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreCommissionRepository extends JpaRepository<StoreCommission, Long> {
    
    List<StoreCommission> findByStoreId(Long storeId);
    List<StoreCommission> findByOrderId(Long orderId);
    List<StoreCommission> findByPaymentId(Long paymentId);
    List<StoreCommission> findByStatus(String status);
    
    @Query("SELECT sc FROM StoreCommission sc LEFT JOIN FETCH sc.store WHERE sc.storeId = :storeId")
    List<StoreCommission> findByStoreIdWithStore(@Param("storeId") Long storeId);
    
    @Query("SELECT sc FROM StoreCommission sc WHERE sc.status = :status ORDER BY sc.createdAt DESC")
    List<StoreCommission> findByStatusOrderByCreatedAt(@Param("status") String status);
}
