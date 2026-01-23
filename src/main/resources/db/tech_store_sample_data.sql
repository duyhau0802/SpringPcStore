-- =========================
-- Tech Store Sample Data for Testing
-- =========================

-- Truncate all tables to ensure clean data insertion
-- Must truncate in reverse order of foreign key dependencies
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE review;
TRUNCATE TABLE cart_item;
TRUNCATE TABLE cart;
TRUNCATE TABLE store_commission;
TRUNCATE TABLE payment;
TRUNCATE TABLE order_item;
TRUNCATE TABLE `order`;
TRUNCATE TABLE inventory;
TRUNCATE TABLE product_spec;
TRUNCATE TABLE product_image;
TRUNCATE TABLE product;
TRUNCATE TABLE brand;
TRUNCATE TABLE category;
TRUNCATE TABLE store;
TRUNCATE TABLE user_role;
TRUNCATE TABLE user;
TRUNCATE TABLE role;

SET FOREIGN_KEY_CHECKS = 1;

-- Reset auto-increment values
ALTER TABLE user AUTO_INCREMENT = 1;
ALTER TABLE role AUTO_INCREMENT = 1;
ALTER TABLE store AUTO_INCREMENT = 1;
ALTER TABLE category AUTO_INCREMENT = 1;
ALTER TABLE brand AUTO_INCREMENT = 1;
ALTER TABLE product AUTO_INCREMENT = 1;
ALTER TABLE product_image AUTO_INCREMENT = 1;
ALTER TABLE product_spec AUTO_INCREMENT = 1;
ALTER TABLE inventory AUTO_INCREMENT = 1;
ALTER TABLE `order` AUTO_INCREMENT = 1;
ALTER TABLE order_item AUTO_INCREMENT = 1;
ALTER TABLE payment AUTO_INCREMENT = 1;
ALTER TABLE store_commission AUTO_INCREMENT = 1;
ALTER TABLE cart AUTO_INCREMENT = 1;
ALTER TABLE cart_item AUTO_INCREMENT = 1;
ALTER TABLE review AUTO_INCREMENT = 1;

-- Insert Roles
INSERT INTO role (id, name) VALUES
(1, 'ADMIN'),
(2, 'USER'),
(3, 'STORE_OWNER');

-- Insert Users first (before store that references them)
INSERT INTO user (id, username, email, password, full_name, phone_number, status) VALUES
(1, 'admin', 'admin@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKV4o.H0xCGpFfgOBkfz4XJ4.Qxe', 'Admin User', '+1234567890', 'ACTIVE'),
(2, 'tole', 'tole@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKV4o.H0xCGpFfgOBkfz4XJ4.Qxe', 'Tole User', '+1234567891', 'ACTIVE'),
(3, 'techguru', 'techguru@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKV4o.H0xCGpFfgOBkfz4XJ4.Qxe', 'Tech Expert', '+1234567892', 'ACTIVE'),
(4, 'gamer123', 'gamer123@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKV4o.H0xCGpFfgOBkfz4XJ4.Qxe', 'Pro Gamer', '+1234567893', 'ACTIVE'),
(5, 'pcbuilder', 'pcbuilder@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKV4o.H0xCGpFfgOBkfz4XJ4.Qxe', 'PC Builder', '+1234567894', 'ACTIVE'),
(6, 'reviewer99', 'reviewer99@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKV4o.H0xCGpFfgOBkfz4XJ4.Qxe', 'Product Reviewer', '+1234567895', 'ACTIVE'),
(7, 'techfan', 'techfan@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKV4o.H0xCGpFfgOBkfz4XJ4.Qxe', 'Tech Enthusiast', '+1234567896', 'ACTIVE');

-- Insert User Roles
INSERT INTO user_role (user_id, role_id) VALUES
(1, 1), -- admin@gmail.com - ADMIN role
(2, 3), -- tole@gmail.com - STORE_OWNER role
(3, 2), (4, 2), (5, 2), (6, 2), (7, 2); -- Other users - USER role

-- Insert Categories for Tech Store
INSERT INTO category (id, name, parent_id) VALUES
(1, 'Laptops', NULL),
(2, 'Desktop PCs', NULL),
(3, 'Monitors', NULL),
(4, 'Graphics Cards', NULL),
(5, 'Processors', NULL),
(6, 'Memory (RAM)', NULL),
(7, 'Storage (SSD/HDD)', NULL),
(8, 'Motherboards', NULL),
(9, 'Power Supplies', NULL),
(10, 'Computer Cases', NULL),
(11, 'Cooling Systems', NULL),
(12, 'Gaming Peripherals', NULL);

-- Insert Brands
INSERT INTO brand (id, name) VALUES
(1, 'ASUS'),
(2, 'MSI'),
(3, 'Gigabyte'),
(4, 'Intel'),
(5, 'AMD'),
(6, 'NVIDIA'),
(7, 'Corsair'),
(8, 'Samsung'),
(9, 'Western Digital'),
(10, 'Seagate'),
(11, 'Cooler Master'),
(12, 'Razer'),
(13, 'Logitech'),
(14, 'Dell'),
(15, 'HP'),
(16, 'Lenovo');

-- Insert Store
INSERT INTO store (id, name, description, owner_id, status) VALUES
(1, 'TechHub Main Store', 'Your trusted computer components store', 1, 'ACTIVE');

-- Insert Products (50 products for pagination testing)
INSERT INTO product (id, store_id, category_id, brand_id, name, price, status, description, created_at) VALUES
-- Laptops (1-8)
(1, 1, 1, 14, 'Dell XPS 15 Laptop', 1299.99, 'ACTIVE', 'High-performance laptop with Intel Core i7', NOW()),
(2, 1, 1, 16, 'Lenovo ThinkPad X1 Carbon', 1499.99, 'ACTIVE', 'Business laptop with premium build quality', NOW()),
(3, 1, 1, 1, 'ASUS ROG Strix G15', 1199.99, 'ACTIVE', 'Gaming laptop with RTX graphics', NOW()),
(4, 1, 1, 2, 'MSI Creator 16', 1899.99, 'ACTIVE', 'Content creation laptop with 4K display', NOW()),
(5, 1, 1, 15, 'HP Spectre x360', 1099.99, 'ACTIVE', '2-in-1 convertible laptop', NOW()),
(6, 1, 1, 1, 'ASUS ZenBook Pro', 999.99, 'ACTIVE', 'Ultrabook with OLED display', NOW()),
(7, 1, 1, 14, 'Dell Inspiron 14', 699.99, 'ACTIVE', 'Affordable laptop for everyday use', NOW()),
(8, 1, 1, 16, 'Lenovo Legion 5', 1099.99, 'ACTIVE', 'Gaming laptop with AMD processor', NOW()),

-- Desktop PCs (9-14)
(9, 1, 2, 1, 'ASUS ROG Strix G35', 1899.99, 'ACTIVE', 'Gaming desktop with liquid cooling', NOW()),
(10, 1, 2, 2, 'MSI Trident X', 1699.99, 'ACTIVE', 'Compact gaming desktop', NOW()),
(11, 1, 2, 14, 'Dell Alienware Aurora', 2199.99, 'ACTIVE', 'High-end gaming desktop', NOW()),
(12, 1, 2, 16, 'Lenovo ThinkCentre M70q', 599.99, 'ACTIVE', 'Business mini desktop', NOW()),
(13, 1, 2, 15, 'HP Pavilion Desktop', 799.99, 'ACTIVE', 'Family desktop computer', NOW()),
(14, 1, 2, 1, 'ASUS ExpertCenter D700', 899.99, 'ACTIVE', 'Business tower desktop', NOW()),

-- Monitors (15-20)
(15, 1, 3, 1, 'ASUS ROG Swift PG279Q', 799.99, 'ACTIVE', '27" 144Hz gaming monitor', NOW()),
(16, 1, 3, 2, 'MSI Optix MAG274QRF', 499.99, 'ACTIVE', '27" 165Hz gaming monitor', NOW()),
(17, 1, 3, 8, 'Samsung Odyssey G7', 699.99, 'ACTIVE', '27" 240Hz curved gaming monitor', NOW()),
(18, 1, 3, 14, 'Dell UltraSharp U2720Q', 599.99, 'ACTIVE', '27" 4K professional monitor', NOW()),
(19, 1, 3, 16, 'Lenovo ThinkVision P27h-20', 399.99, 'ACTIVE', '27" QHD business monitor', NOW()),
(20, 1, 3, 15, 'HP EliteDisplay E273', 299.99, 'ACTIVE', '27" FHD office monitor', NOW()),

-- Graphics Cards (21-26)
(21, 1, 4, 6, 'NVIDIA GeForce RTX 4090', 1599.99, 'ACTIVE', 'Flagship gaming graphics card', NOW()),
(22, 1, 4, 6, 'NVIDIA GeForce RTX 4080', 1199.99, 'ACTIVE', 'High-end gaming graphics card', NOW()),
(23, 1, 4, 6, 'NVIDIA GeForce RTX 4070 Ti', 799.99, 'ACTIVE', 'Mid-range gaming graphics card', NOW()),
(24, 1, 4, 5, 'AMD Radeon RX 7900 XTX', 999.99, 'ACTIVE', 'AMD flagship graphics card', NOW()),
(25, 1, 4, 5, 'AMD Radeon RX 7800 XT', 499.99, 'ACTIVE', 'AMD mid-range graphics card', NOW()),
(26, 1, 4, 1, 'ASUS TUF Gaming RTX 4060', 399.99, 'ACTIVE', 'Budget gaming graphics card', NOW()),

-- Processors (27-32)
(27, 1, 5, 4, 'Intel Core i9-13900K', 599.99, 'ACTIVE', 'Flagship desktop processor', NOW()),
(28, 1, 5, 4, 'Intel Core i7-13700K', 419.99, 'ACTIVE', 'High-end desktop processor', NOW()),
(29, 1, 5, 4, 'Intel Core i5-13600K', 319.99, 'ACTIVE', 'Mid-range desktop processor', NOW()),
(30, 1, 5, 5, 'AMD Ryzen 9 7950X', 549.99, 'ACTIVE', 'AMD flagship desktop processor', NOW()),
(31, 1, 5, 5, 'AMD Ryzen 7 7700X', 399.99, 'ACTIVE', 'AMD high-end desktop processor', NOW()),
(32, 1, 5, 5, 'AMD Ryzen 5 7600X', 299.99, 'ACTIVE', 'AMD mid-range desktop processor', NOW()),

-- Memory (33-36)
(33, 1, 6, 7, 'Corsair Vengeance RGB Pro 32GB', 159.99, 'ACTIVE', 'DDR4-3200 RGB RAM kit', NOW()),
(34, 1, 6, 7, 'Corsair Dominator Platinum 32GB', 249.99, 'ACTIVE', 'DDR4-3600 high-performance RAM', NOW()),
(35, 1, 6, 8, 'Samsung DDR5 32GB', 299.99, 'ACTIVE', 'DDR5-4800 RAM kit', NOW()),
(36, 1, 6, 1, 'ASUS ROG Strix 32GB', 199.99, 'ACTIVE', 'DDR4-3600 gaming RAM', NOW()),

-- Storage (37-42)
(37, 1, 7, 8, 'Samsung 980 Pro 1TB', 149.99, 'ACTIVE', 'NVMe Gen4 SSD', NOW()),
(38, 1, 7, 9, 'WD Black SN850X 1TB', 129.99, 'ACTIVE', 'NVMe Gen4 gaming SSD', NOW()),
(39, 1, 7, 10, 'Seagate FireCuda 530 1TB', 139.99, 'ACTIVE', 'NVMe Gen4 SSD', NOW()),
(40, 1, 7, 8, 'Samsung 870 EVO 1TB', 99.99, 'ACTIVE', 'SATA SSD', NOW()),
(41, 1, 7, 9, 'WD Blue 2TB HDD', 59.99, 'ACTIVE', '7200RPM hard drive', NOW()),
(42, 1, 7, 10, 'Seagate Barracuda 4TB HDD', 89.99, 'ACTIVE', '5400RPM hard drive', NOW()),

-- Motherboards (43-46)
(43, 1, 8, 1, 'ASUS ROG Strix Z790-E', 449.99, 'ACTIVE', 'Intel Z790 gaming motherboard', NOW()),
(44, 1, 8, 3, 'Gigabyte X670 Aorus Elite', 329.99, 'ACTIVE', 'AMD X670 gaming motherboard', NOW()),
(45, 1, 8, 2, 'MSI MAG B760 Tomahawk', 199.99, 'ACTIVE', 'Intel B760 motherboard', NOW()),
(46, 1, 8, 1, 'ASUS TUF Gaming B650-Plus', 179.99, 'ACTIVE', 'AMD B650 motherboard', NOW()),

-- Power Supplies (47-50)
(47, 1, 9, 7, 'Corsair RM850x', 119.99, 'ACTIVE', '850W 80+ Gold PSU', NOW()),
(48, 1, 9, 11, 'Cooler Master MWE 750', 79.99, 'ACTIVE', '750W 80+ Bronze PSU', NOW()),
(49, 1, 9, 7, 'Corsair AX1200', 249.99, 'ACTIVE', '1200W 80+ Platinum PSU', NOW()),
(50, 1, 9, 11, 'Cooler Master V750', 99.99, 'ACTIVE', '750W 80+ Gold PSU', NOW());

-- Insert Inventory for all products
INSERT INTO inventory (store_id, product_id, quantity, updated_at) VALUES
(1, 1, 15, NOW()), (1, 2, 12, NOW()), (1, 3, 8, NOW()), (1, 4, 6, NOW()),
(1, 5, 20, NOW()), (1, 6, 18, NOW()), (1, 7, 25, NOW()), (1, 8, 10, NOW()),
(1, 9, 5, NOW()), (1, 10, 7, NOW()), (1, 11, 3, NOW()), (1, 12, 15, NOW()),
(1, 13, 22, NOW()), (1, 14, 12, NOW()), (1, 15, 9, NOW()), (1, 16, 11, NOW()),
(1, 17, 4, NOW()), (1, 18, 13, NOW()), (1, 19, 16, NOW()), (1, 20, 19, NOW()),
(1, 21, 2, NOW()), (1, 22, 4, NOW()), (1, 23, 8, NOW()), (1, 24, 3, NOW()),
(1, 25, 10, NOW()), (1, 26, 14, NOW()), (1, 27, 6, NOW()), (1, 28, 9, NOW()),
(1, 29, 17, NOW()), (1, 30, 5, NOW()), (1, 31, 8, NOW()), (1, 32, 12, NOW()),
(1, 33, 20, NOW()), (1, 34, 15, NOW()), (1, 35, 11, NOW()), (1, 36, 18, NOW()),
(1, 37, 25, NOW()), (1, 38, 22, NOW()), (1, 39, 19, NOW()), (1, 40, 30, NOW()),
(1, 41, 35, NOW()), (1, 42, 28, NOW()), (1, 43, 7, NOW()), (1, 44, 9, NOW()),
(1, 45, 13, NOW()), (1, 46, 16, NOW()), (1, 47, 11, NOW()), (1, 48, 14, NOW()),
(1, 49, 4, NOW()), (1, 50, 8, NOW());

-- Insert Product Images (main images for each product)
INSERT INTO product_image (product_id, image_url, is_main) VALUES
(1, 'https://placehold.co/600x400', 1),
(2, 'https://placehold.co/600x400', 1),
(3, 'https://placehold.co/600x400', 1),
(4, 'https://placehold.co/600x400', 1),
(5, 'https://placehold.co/600x400', 1),
(6, 'https://placehold.co/600x400', 1),
(7, 'https://placehold.co/600x400', 1),
(8, 'https://placehold.co/600x400', 1),
(9, 'https://placehold.co/600x400', 1),
(10, 'https://placehold.co/600x400', 1),
(11, 'https://placehold.co/600x400', 1),
(12, 'https://placehold.co/600x400', 1),
(13, 'https://placehold.co/600x400', 1),
(14, 'https://placehold.co/600x400', 1),
(15, 'https://placehold.co/600x400', 1),
(16, 'https://placehold.co/600x400', 1),
(17, 'https://placehold.co/600x400', 1),
(18, 'https://placehold.co/600x400', 1),
(19, 'https://placehold.co/600x400', 1),
(20, 'https://placehold.co/600x400', 1),
(21, 'https://placehold.co/600x400', 1),
(22, 'https://placehold.co/600x400', 1),
(23, 'https://placehold.co/600x400', 1),
(24, 'https://placehold.co/600x400', 1),
(25, 'https://placehold.co/600x400', 1),
(26, 'https://placehold.co/600x400', 1),
(27, 'https://placehold.co/600x400', 1),
(28, 'https://placehold.co/600x400', 1),
(29, 'https://placehold.co/600x400', 1),
(30, 'https://placehold.co/600x400', 1),
(31, 'https://placehold.co/600x400', 1),
(32, 'https://placehold.co/600x400', 1),
(33, 'https://placehold.co/600x400', 1),
(34, 'https://placehold.co/600x400', 1),
(35, 'https://placehold.co/600x400', 1),
(36, 'https://placehold.co/600x400', 1),
(37, 'https://placehold.co/600x400', 1),
(38, 'https://placehold.co/600x400', 1),
(39, 'https://placehold.co/600x400', 1),
(40, 'https://placehold.co/600x400', 1),
(41, 'https://placehold.co/600x400', 1),
(42, 'https://placehold.co/600x400', 1),
(43, 'https://placehold.co/600x400', 1),
(44, 'https://placehold.co/600x400', 1),
(45, 'https://placehold.co/600x400', 1),
(46, 'https://placehold.co/600x400', 1),
(47, 'https://placehold.co/600x400', 1),
(48, 'https://placehold.co/600x400', 1),
(49, 'https://placehold.co/600x400', 1),
(50, 'https://placehold.co/600x400', 1);

-- Insert Sample Reviews with Different Ratings
INSERT INTO review (user_id, product_id, rating, comment, created_at) VALUES
-- 5-star reviews
(1, 1, 5, 'Excellent laptop! Fast performance and beautiful display. Highly recommend for professionals.', NOW()),
(2, 21, 5, 'Best graphics card I ever owned! Runs all games at max settings 1440p.', NOW()),
(3, 27, 5, 'Intel i9-13900K is a beast! Perfect for video editing and gaming.', NOW()),
(4, 15, 5, 'Amazing monitor! 144Hz gaming is incredible, colors are perfect.', NOW()),
(5, 37, 5, 'Lightning fast SSD! Boot time is under 10 seconds.', NOW()),

-- 4-star reviews
(1, 2, 4, 'Great business laptop, battery life could be better though.', NOW()),
(2, 22, 4, 'Very powerful GPU, runs hot under load but manageable.', NOW()),
(3, 28, 4, 'Solid CPU for gaming, good value for money.', NOW()),
(4, 16, 4, 'Good gaming monitor, stand could be more adjustable.', NOW()),
(5, 38, 4, 'Fast SSD, price is a bit high but worth it.', NOW()),

-- 3-star reviews
(1, 3, 3, 'Decent gaming laptop, fan noise is noticeable under load.', NOW()),
(2, 23, 4, 'Good mid-range GPU, handles most games well at 1080p.', NOW()),
(3, 29, 3, 'Average CPU, gets the job done for basic tasks.', NOW()),
(4, 17, 3, 'Curved monitor takes getting used to, good for gaming though.', NOW()),
(5, 39, 3, 'Decent SSD performance, had some driver issues initially.', NOW()),

-- 2-star reviews
(1, 4, 2, 'Overpriced for what you get, thermal throttling issues.', NOW()),
(2, 24, 3, 'AMD GPU is okay, driver support needs improvement.', NOW()),
(3, 30, 2, 'Ryzen 9 runs very hot, stock cooler is inadequate.', NOW()),
(4, 18, 4, 'Great 4K monitor, refresh rate is only 60Hz though.', NOW()),
(5, 40, 2, 'SATA SSD is slow compared to NVMe, but reliable.', NOW()),

-- 1-star reviews
(1, 5, 2, 'Poor build quality, hinge broke after 6 months.', NOW()),
(2, 25, 2, 'Disappointing performance for the price point.', NOW()),
(3, 31, 1, 'CPU arrived DOA, terrible customer service.', NOW()),
(4, 19, 2, 'Monitor has backlight bleed, poor QC.', NOW()),
(5, 41, 1, 'Hard drive failed after 2 months, lost all data.', NOW()),

-- More reviews for better testing
(1, 6, 4, 'Great ultrabook, OLED display is stunning!', NOW()),
(2, 26, 3, 'Budget GPU that handles esports games well.', NOW()),
(3, 32, 4, 'Good value CPU for budget gaming builds.', NOW()),
(4, 20, 3, 'Basic office monitor, gets the job done.', NOW()),
(5, 42, 3, 'Reliable hard drive, good for storage expansion.', NOW()),

-- Additional mixed reviews
(1, 7, 3, 'Budget laptop with decent performance, keyboard is mediocre.', NOW()),
(2, 33, 5, 'Best RAM I ever bought! RGB lighting is awesome.', NOW()),
(3, 34, 4, 'High-end RAM with great performance, expensive though.', NOW()),
(4, 43, 4, 'Excellent motherboard for Intel builds, BIOS is user-friendly.', NOW()),
(5, 44, 3, 'Good AMD motherboard, VRM could be stronger.', NOW()),

-- Final batch of reviews
(1, 45, 4, 'Solid B760 motherboard, great for budget builds.', NOW()),
(2, 46, 3, 'Decent B650 motherboard, lacks some features.', NOW()),
(3, 47, 5, 'Best PSU I ever owned! Fully modular and efficient.', NOW()),
(4, 48, 3, 'Basic PSU that works, cables are not modular.', NOW()),
(5, 49, 4, 'Expensive but worth it for high-end builds.', NOW());

-- Create View for Product Average Rating (for easier querying)
CREATE OR REPLACE VIEW product_rating_view AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    COUNT(r.id) as review_count,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COALESCE(MIN(r.rating), 0) as min_rating,
    COALESCE(MAX(r.rating), 0) as max_rating
FROM product p
LEFT JOIN review r ON p.id = r.product_id
GROUP BY p.id, p.name;

-- Create View for Products with Full Details
CREATE OR REPLACE VIEW product_full_view AS
SELECT 
    p.*,
    c.name as category_name,
    b.name as brand_name,
    s.name as store_name,
    i.quantity as stock_quantity,
    pr.review_count,
    pr.average_rating,
    CASE 
        WHEN pr.average_rating >= 4.5 THEN 'Excellent'
        WHEN pr.average_rating >= 3.5 THEN 'Good'
        WHEN pr.average_rating >= 2.5 THEN 'Average'
        WHEN pr.average_rating >= 1.5 THEN 'Poor'
        ELSE 'Very Poor'
    END as rating_category
FROM product p
LEFT JOIN category c ON p.category_id = c.id
LEFT JOIN brand b ON p.brand_id = b.id
LEFT JOIN store s ON p.store_id = s.id
LEFT JOIN inventory i ON p.id = i.product_id AND p.store_id = i.store_id
LEFT JOIN product_rating_view pr ON p.id = pr.product_id;

-- =========================
-- Test Queries for Pagination and Rating
-- =========================

-- Test 1: Basic Pagination (Page 1, Size 12)
-- SELECT * FROM product_full_view WHERE status = 'ACTIVE' ORDER BY id LIMIT 12 OFFSET 0;

-- Test 2: Pagination with Rating Filter (4+ stars)
-- SELECT * FROM product_full_view WHERE status = 'ACTIVE' AND average_rating >= 4.0 ORDER BY id LIMIT 12 OFFSET 0;

-- Test 3: Category Filter with Pagination
-- SELECT * FROM product_full_view WHERE status = 'ACTIVE' AND category_name = 'Laptops' ORDER BY id LIMIT 12 OFFSET 0;

-- Test 4: Price Range Filter with Pagination
-- SELECT * FROM product_full_view WHERE status = 'ACTIVE' AND price BETWEEN 500 AND 1500 ORDER BY id LIMIT 12 OFFSET 0;

-- Test 5: Combined Filters (Category + Rating + Price)
-- SELECT * FROM product_full_view 
-- WHERE status = 'ACTIVE' 
--   AND category_name = 'Graphics Cards' 
--   AND average_rating >= 3.5 
--   AND price BETWEEN 300 AND 1000 
-- ORDER BY id LIMIT 12 OFFSET 0;

-- Test 6: Search by Name with Pagination
-- SELECT * FROM product_full_view 
-- WHERE status = 'ACTIVE' 
--   AND (name LIKE '%RTX%' OR name LIKE '%Gaming%')
-- ORDER BY id LIMIT 12 OFFSET 0;
