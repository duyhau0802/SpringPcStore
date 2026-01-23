package com.ecom.SpringPcStore.repository;

import com.ecom.SpringPcStore.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    
    Optional<Store> findByOwnerId(Long ownerId);
    boolean existsByOwnerId(Long ownerId);
    
    @Query("SELECT s FROM Store s LEFT JOIN FETCH s.owner WHERE s.id = :id")
    Optional<Store> findByIdWithOwner(@Param("id") Long id);
}
