//package com.ecom.SpringPcStore.config;
//
//import com.ecom.SpringPcStore.model.Category;
//import com.ecom.SpringPcStore.model.Product;
//import com.ecom.SpringPcStore.repository.ProductRepository;
//import com.ecom.SpringPcStore.repository.CategoryRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import java.util.Arrays;
//
//@Component
//public class DataSeeder implements CommandLineRunner {
//
//    private final ProductRepository productRepository;
//    private final CategoryRepository categoryRepository;
//
//    public DataSeeder(ProductRepository productRepository, CategoryRepository categoryRepository) {
//        this.productRepository = productRepository;
//        this.categoryRepository = categoryRepository;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//        // Clear all existing data
//        productRepository.deleteAll();
//        categoryRepository.deleteAll();
//
//        // Create Categories
//        Category electronics = new Category();
//        electronics.setName("Electronics");
//
//        Category clothing = new Category();
//        clothing.setName("Clothing");
//
//        Category home = new Category();
//        home.setName("Home");
//
//        categoryRepository.saveAll(Arrays.asList(electronics, clothing, home));
//
//        // Create Products
//        Product phone = new Product();
//        phone.setName("Phone");
//        phone.setDescription("A sleek smartphone with a vibrant display.");
//        phone.setImageUrl("https://placehold.co/600x400");
//        phone.setPrice(699.99);
//        phone.setCategory(electronics);
//
//        Product laptop = new Product();
//        laptop.setName("Laptop");
//        laptop.setDescription("A powerful laptop suitable for gaming and work.");
//        laptop.setImageUrl("https://placehold.co/600x400");
//        laptop.setPrice(1199.99);
//        laptop.setCategory(electronics);
//
//        Product jacket = new Product();
//        jacket.setName("Jacket");
//        jacket.setDescription("Insulated jacket suitable for all seasons.");
//        jacket.setImageUrl("https://placehold.co/600x400");
//        jacket.setPrice(129.99);
//        jacket.setCategory(clothing);
//
//        Product blender = new Product();
//        blender.setName("Blender");
//        blender.setDescription("High-speed blender for smoothies and soups.");
//        blender.setImageUrl("https://placehold.co/600x400");
//        blender.setPrice(89.99);
//        blender.setCategory(home);
//
//        productRepository.saveAll(Arrays.asList(phone, laptop, jacket, blender));
//    }
//}
