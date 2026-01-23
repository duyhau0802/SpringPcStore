package com.ecom.SpringPcStore.repository;

import com.ecom.SpringPcStore.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByUserId(Long userId);
    Page<Order> findByUserId(Long userId, Pageable pageable);
    
    List<Order> findByStatus(String status);
    Page<Order> findByStatus(String status, Pageable pageable);
    
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.orderItems LEFT JOIN FETCH o.payment WHERE o.id = :id")
    Optional<Order> findByIdWithDetails(@Param("id") Long id);
    
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.orderItems LEFT JOIN FETCH o.payment WHERE o.userId = :userId")
    List<Order> findByUserIdWithDetails(@Param("userId") Long userId);
    
    @Query("SELECT o FROM Order o WHERE o.status = :status ORDER BY o.createdAt DESC")
    List<Order> findByStatusOrderByCreatedAt(@Param("status") String status);
}
