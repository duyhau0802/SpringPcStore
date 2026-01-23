package com.ecom.SpringPcStore.service;

import com.ecom.SpringPcStore.dto.request.ProductRequest;
import com.ecom.SpringPcStore.dto.request.ProductImageRequest;
import com.ecom.SpringPcStore.dto.request.ProductSpecRequest;
import com.ecom.SpringPcStore.dto.response.ProductResponse;
import com.ecom.SpringPcStore.entity.*;
import com.ecom.SpringPcStore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductSpecRepository productSpecRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final InventoryRepository inventoryRepository;
    private final ReviewRepository reviewRepository;

    public Page<ProductResponse> getAllProducts(Long storeId, String status, Pageable pageable) {
        System.out.println("Fetching products with storeId: " + storeId + ", status: " + status);
        Page<ProductResponse> products = productRepository.searchProducts(null, null, null, storeId, status, null, null, null, pageable)
                .map(this::convertToResponse);
        System.out.println("Found " + products.getTotalElements() + " products");
        return products;
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToResponse(product);
    }

    public ProductResponse getProductByIdWithDetails(Long id) {
        System.out.println("Fetching product details for ID: " + id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        // Manually fetch relationships to avoid lazy loading issues
        List<ProductImage> images = productImageRepository.findByProductId(id);
        List<ProductSpec> specs = productSpecRepository.findByProductId(id);
        
        product.setProductImages(images);
        product.setProductSpecs(specs);
        
        System.out.println("Found product: " + product.getName() + ", Images: " + images.size() + ", Specs: " + specs.size());
        
        return convertToResponse(product);
    }

    public Page<ProductResponse> searchProducts(String name, Long categoryId, Long brandId, 
                                              Long storeId, String status, Double minRating, 
                                              Double minPrice, Double maxPrice, Pageable pageable) {
        
        // Debug price filter only
        if (minPrice != null || maxPrice != null) {
            System.out.println("=== PRICE FILTER DEBUG ===");
            System.out.println("  Price range: " + minPrice + " to " + maxPrice);
        }
        
        Page<ProductResponse> results = productRepository.searchProducts(name, categoryId, brandId, storeId, status, minRating, minPrice, maxPrice, pageable)
                .map(this::convertToResponse);
        
        // Debug price filter results only
        if (minPrice != null || maxPrice != null) {
            System.out.println("  Found " + results.getTotalElements() + " products in price range");
            
            results.getContent().stream().limit(3).forEach(product -> {
                boolean inRange = (minPrice == null || product.getPrice().doubleValue() >= minPrice) && 
                               (maxPrice == null || product.getPrice().doubleValue() <= maxPrice);
                System.out.println("  " + product.getName() + " - $" + product.getPrice() + " - in range: " + inRange);
            });
            
            System.out.println("=== END PRICE FILTER DEBUG ===");
        }
        
        return results;
    }

    public List<ProductResponse> getProductsByStore(Long storeId) {
        return productRepository.findByStoreId(storeId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse createProduct(ProductRequest request) {
        // Validate store, category, brand exist
        storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + request.getStoreId()));
        
        categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
        
        brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found with id: " + request.getBrandId()));

        // Check if product name already exists
        if (productRepository.existsByName(request.getName())) {
            throw new RuntimeException("Product name already exists");
        }

        Product product = new Product();
        product.setStoreId(request.getStoreId());
        product.setCategoryId(request.getCategoryId());
        product.setBrandId(request.getBrandId());
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setStatus(request.getStatus());
        product.setDescription(request.getDescription());

        Product savedProduct = productRepository.save(product);

        // Save product images
        if (request.getProductImages() != null) {
            for (ProductImageRequest imageRequest : request.getProductImages()) {
                ProductImage image = new ProductImage();
                image.setProductId(savedProduct.getId());
                image.setImageUrl(imageRequest.getImageUrl());
                image.setIsMain(imageRequest.getIsMain());
                productImageRepository.save(image);
            }
        }

        // Save product specs
        if (request.getProductSpecs() != null) {
            for (ProductSpecRequest specRequest : request.getProductSpecs()) {
                ProductSpec spec = new ProductSpec();
                spec.setProductId(savedProduct.getId());
                spec.setSpecKey(specRequest.getSpecKey());
                spec.setSpecValue(specRequest.getSpecValue());
                productSpecRepository.save(spec);
            }
        }

        // Create inventory record
        Inventory inventory = new Inventory();
        inventory.setStoreId(request.getStoreId());
        inventory.setProductId(savedProduct.getId());
        inventory.setQuantity(0);
        inventoryRepository.save(inventory);

        return convertToResponse(savedProduct);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Validate store, category, brand exist
        storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + request.getStoreId()));
        
        categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
        
        brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found with id: " + request.getBrandId()));

        // Check if name is already taken by another product
        if (!product.getName().equals(request.getName()) && 
            productRepository.existsByName(request.getName())) {
            throw new RuntimeException("Product name already exists");
        }

        product.setStoreId(request.getStoreId());
        product.setCategoryId(request.getCategoryId());
        product.setBrandId(request.getBrandId());
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setStatus(request.getStatus());
        product.setDescription(request.getDescription());

        Product updatedProduct = productRepository.save(product);
        return convertToResponse(updatedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Delete related entities
        productImageRepository.deleteByProductId(id);
        productSpecRepository.deleteByProductId(id);
        inventoryRepository.deleteByProductId(id);

        productRepository.delete(product);
    }

    private ProductResponse convertToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setStoreId(product.getStoreId());
        response.setCategoryId(product.getCategoryId());
        response.setBrandId(product.getBrandId());
        response.setName(product.getName());
        response.setPrice(product.getPrice());
        response.setStatus(product.getStatus());
        response.setDescription(product.getDescription());
        response.setCreatedAt(product.getCreatedAt());

        // Initialize lazy loaded relationships
        if (product.getStore() != null) {
            ProductResponse.StoreResponse storeResponse = new ProductResponse.StoreResponse();
            storeResponse.setId(product.getStore().getId());
            storeResponse.setName(product.getStore().getName());
            storeResponse.setStatus(product.getStore().getStatus());
            response.setStore(storeResponse);
        }

        if (product.getCategory() != null) {
            ProductResponse.CategoryResponse categoryResponse = new ProductResponse.CategoryResponse();
            categoryResponse.setId(product.getCategory().getId());
            categoryResponse.setName(product.getCategory().getName());
            categoryResponse.setParentId(product.getCategory().getParentId());
            response.setCategory(categoryResponse);
        }

        if (product.getBrand() != null) {
            ProductResponse.BrandResponse brandResponse = new ProductResponse.BrandResponse();
            brandResponse.setId(product.getBrand().getId());
            brandResponse.setName(product.getBrand().getName());
            response.setBrand(brandResponse);
        }

        // Get product images
        List<ProductImage> images = productImageRepository.findByProductId(product.getId());
        response.setProductImages(images.stream()
                .map(image -> {
                    ProductResponse.ProductImageResponse imageResponse = new ProductResponse.ProductImageResponse();
                    imageResponse.setId(image.getId());
                    imageResponse.setImageUrl(image.getImageUrl());
                    imageResponse.setIsMain(image.getIsMain());
                    return imageResponse;
                })
                .collect(Collectors.toList()));

        // Get product specs
        List<ProductSpec> specs = productSpecRepository.findByProductId(product.getId());
        response.setProductSpecs(specs.stream()
                .map(spec -> {
                    ProductResponse.ProductSpecResponse specResponse = new ProductResponse.ProductSpecResponse();
                    specResponse.setId(spec.getId());
                    specResponse.setSpecKey(spec.getSpecKey());
                    specResponse.setSpecValue(spec.getSpecValue());
                    return specResponse;
                })
                .collect(Collectors.toList()));

        // Get inventory
        Optional<Inventory> inventoryOpt = inventoryRepository.findByProductId(product.getId());
        if (inventoryOpt.isPresent()) {
            Inventory inventory = inventoryOpt.get();
            ProductResponse.InventoryResponse inventoryResponse = new ProductResponse.InventoryResponse();
            inventoryResponse.setId(inventory.getId());
            inventoryResponse.setQuantity(inventory.getQuantity());
            inventoryResponse.setUpdatedAt(inventory.getUpdatedAt());
            response.setInventory(inventoryResponse);
        }

        // Calculate rating information
        List<Review> reviews = reviewRepository.findByProductId(product.getId());
        if (!reviews.isEmpty()) {
            double averageRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            response.setAverageRating(averageRating);
            response.setReviewCount(reviews.size());
            System.out.println("Product " + product.getId() + " - Rating: " + averageRating + ", Reviews: " + reviews.size());
        } else {
            response.setAverageRating(0.0);
            response.setReviewCount(0);
            System.out.println("Product " + product.getId() + " - No reviews");
        }

        return response;
    }
}
