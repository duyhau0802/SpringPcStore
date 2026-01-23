package com.ecom.SpringPcStore.repository;

import com.ecom.SpringPcStore.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByOrderId(Long orderId);
    List<Payment> findByStatus(String status);
    Page<Payment> findByOrderId(Long orderId, Pageable pageable);
    
    @Query("SELECT p FROM Payment p LEFT JOIN FETCH p.order WHERE p.id = :id")
    Optional<Payment> findByIdWithOrder(@Param("id") Long id);
}
