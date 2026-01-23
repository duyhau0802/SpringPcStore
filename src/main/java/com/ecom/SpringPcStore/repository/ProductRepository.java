package com.ecom.SpringPcStore.repository;

import com.ecom.SpringPcStore.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Basic queries
    Optional<Product> findByName(String name);
    boolean existsByName(String name);
    
    // Store related
    List<Product> findByStoreId(Long storeId);
    Page<Product> findByStoreId(Long storeId, Pageable pageable);
    
    // Category related
    List<Product> findByCategoryId(Long categoryId);
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    
    // Brand related
    List<Product> findByBrandId(Long brandId);
    Page<Product> findByBrandId(Long brandId, Pageable pageable);
    
    // Status related
    List<Product> findByStatus(String status);
    Page<Product> findByStatus(String status, Pageable pageable);
    
    // Search functionality with rating and price filters
    @Query("SELECT p FROM Product p LEFT JOIN p.reviews r WHERE " +
           "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:categoryId IS NULL OR p.categoryId = :categoryId) AND " +
           "(:brandId IS NULL OR p.brandId = :brandId) AND " +
           "(:storeId IS NULL OR p.storeId = :storeId) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:minRating IS NULL OR (SELECT AVG(rv.rating) FROM Review rv WHERE rv.product.id = p.id) >= :minRating) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Product> searchProducts(@Param("name") String name,
                                @Param("categoryId") Long categoryId,
                                @Param("brandId") Long brandId,
                                @Param("storeId") Long storeId,
                                @Param("status") String status,
                                @Param("minRating") Double minRating,
                                @Param("minPrice") Double minPrice,
                                @Param("maxPrice") Double maxPrice,
                                Pageable pageable);
    
    // Find products with images and specs
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.productImages LEFT JOIN FETCH p.productSpecs LEFT JOIN FETCH p.store LEFT JOIN FETCH p.category LEFT JOIN FETCH p.brand WHERE p.id = :id")
    Optional<Product> findByIdWithImagesAndSpecs(@Param("id") Long id);
    
    // Find products by store with inventory
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.store WHERE p.storeId = :storeId")
    List<Product> findByStoreIdWithStore(@Param("storeId") Long storeId);
}
