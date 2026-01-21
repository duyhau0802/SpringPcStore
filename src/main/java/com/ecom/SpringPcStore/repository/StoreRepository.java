package com.ecom.SpringPcStore.repository;

import com.ecom.SpringPcStore.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    Optional<Store> findByUserId(Long userId);
}
