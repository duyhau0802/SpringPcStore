package com.ecom.SpringPcStore.repository;

import com.ecom.SpringPcStore.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
    List<Category> findByNameContainingIgnoreCase(String name);
    List<Category> findByParentId(Long parentId);
    List<Category> findByParentIdIsNull();
    
    @Query("SELECT c FROM Category c WHERE c.isActive = true")
    List<Category> findActiveCategories();
    
    @Query("SELECT c FROM Category c WHERE c.parentId = :parentId AND c.isActive = true")
    List<Category> findActiveSubCategories(@Param("parentId") Long parentId);
    
    boolean existsByName(String name);
}
