package com.ecom.SpringPcStore.repository;

import com.ecom.SpringPcStore.entity.StoreCommission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreCommissionRepository extends JpaRepository<StoreCommission, Long> {
    List<StoreCommission> findByStoreId(Long storeId);
}
