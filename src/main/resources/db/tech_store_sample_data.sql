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
INSERT INTO category (name, description, parent_id, created_at, updated_at) VALUES
('Laptop', 'Laptops and notebook computers for work and gaming', NULL, NOW(), NOW()),
('Headset', 'Audio headsets and headphones for music and gaming', NULL, NOW(), NOW()),
('Phone', 'Smartphones and mobile phones', NULL, NOW(), NOW()),
('TV', 'Televisions and smart TVs for home entertainment', NULL, NOW(), NOW()),
('Display', 'Computer monitors and displays', NULL, NOW(), NOW()),
('HDD', 'Hard disk drives and storage solutions', NULL, NOW(), NOW()),
('UPC Scan', 'Barcode scanners and UPC scanning equipment', NULL, NOW(), NOW()),
('Tools', 'Tools and equipment for computer repair and maintenance', NULL, NOW(), NOW());

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

-- Insert Products (56 products for new categories)
INSERT INTO product (id, store_id, category_id, brand_id, name, price, status, description, created_at) VALUES
-- Laptop (1-8)
(1, 1, 1, 14, 'Dell XPS 15 Laptop', 1299.99, 'ACTIVE', 'High-performance laptop with Intel Core i7', NOW()),
(2, 1, 1, 16, 'Lenovo ThinkPad X1 Carbon', 1499.99, 'ACTIVE', 'Business laptop with premium build quality', NOW()),
(3, 1, 1, 1, 'ASUS ROG Strix G15', 1199.99, 'ACTIVE', 'Gaming laptop with RTX graphics', NOW()),
(4, 1, 1, 2, 'MSI Creator 16', 1899.99, 'ACTIVE', 'Content creation laptop with 4K display', NOW()),
(5, 1, 1, 15, 'HP Spectre x360', 1099.99, 'ACTIVE', '2-in-1 convertible laptop', NOW()),
(6, 1, 1, 1, 'ASUS ZenBook Pro', 999.99, 'ACTIVE', 'Ultrabook with OLED display', NOW()),
(7, 1, 1, 14, 'Dell Inspiron 14', 699.99, 'ACTIVE', 'Affordable laptop for everyday use', NOW()),
(8, 1, 1, 16, 'Lenovo Legion 5', 1099.99, 'ACTIVE', 'Gaming laptop with AMD processor', NOW()),

-- Headset (9-14)
(9, 1, 2, 12, 'Razer BlackShark V2 Pro', 179.99, 'ACTIVE', 'Wireless gaming headset with THX spatial audio', NOW()),
(10, 1, 2, 13, 'Logitech G Pro X', 249.99, 'ACTIVE', 'Professional gaming headset with Blue VO!CE', NOW()),
(11, 1, 2, 1, 'ASUS ROG Strix Go 2.4', 129.99, 'ACTIVE', 'Wireless gaming headset with ANC', NOW()),
(12, 1, 2, 2, 'MSI Immerse GH70', 149.99, 'ACTIVE', 'Wireless gaming headset with vibration', NOW()),
(13, 1, 2, 7, 'Corsair Virtuoso RGB Wireless', 199.99, 'ACTIVE', 'High-fidelity wireless gaming headset', NOW()),
(14, 1, 2, 8, 'Samsung Galaxy Buds Pro', 229.99, 'ACTIVE', 'True wireless earbuds with ANC', NOW()),

-- Phone (15-22)
(15, 1, 3, 8, 'Samsung Galaxy S24 Ultra', 1299.99, 'ACTIVE', 'Premium Android phone with S Pen', NOW()),
(16, 1, 3, 14, 'Dell Mobile Precision', 899.99, 'ACTIVE', 'Business smartphone with enterprise features', NOW()),
(17, 1, 3, 1, 'ASUS ROG Phone 8', 1099.99, 'ACTIVE', 'Gaming phone with advanced cooling', NOW()),
(18, 1, 3, 16, 'Lenovo Legion Phone Duel 2', 799.99, 'ACTIVE', 'Gaming phone with dual batteries', NOW()),
(19, 1, 3, 15, 'HP Elite Dragonfly', 1199.99, 'ACTIVE', 'Premium business laptop-phone hybrid', NOW()),
(20, 1, 3, 8, 'Samsung Galaxy Tab S9', 999.99, 'ACTIVE', 'Premium Android tablet for productivity', NOW()),
(21, 1, 3, 1, 'ASUS Zenfone 10', 699.99, 'ACTIVE', 'Compact flagship Android phone', NOW()),
(22, 1, 3, 2, 'MSI Claw', 699.99, 'ACTIVE', 'Handheld gaming device', NOW()),

-- TV (23-28)
(23, 1, 4, 8, 'Samsung 65" QLED 4K Smart TV', 1499.99, 'ACTIVE', 'Premium QLED TV with HDR10+', NOW()),
(24, 1, 4, 14, 'Dell 55" 4K UltraSharp Monitor', 899.99, 'ACTIVE', 'Professional 4K monitor for office', NOW()),
(25, 1, 4, 1, 'ASUS ROG Strix 43" Gaming Monitor', 1299.99, 'ACTIVE', 'Large gaming monitor with 144Hz', NOW()),
(26, 1, 4, 16, 'Lenovo ThinkVision 65" 4K Display', 1199.99, 'ACTIVE', 'Business display with video conferencing', NOW()),
(27, 1, 4, 15, 'HP Omen 27" Gaming Monitor', 499.99, 'ACTIVE', 'Gaming monitor with 1ms response time', NOW()),
(28, 1, 4, 2, 'MSI Optix MAG321CQR', 599.99, 'ACTIVE', '32" curved gaming monitor', NOW()),

-- Display (29-35)
(29, 1, 5, 1, 'ASUS ProArt PA279QV', 599.99, 'ACTIVE', '27" 4K professional monitor', NOW()),
(30, 1, 5, 2, 'MSI Prestige PS341WU', 1299.99, 'ACTIVE', '34" ultrawide professional monitor', NOW()),
(31, 1, 5, 8, 'Samsung Odyssey G9', 1499.99, 'ACTIVE', '49" super ultrawide gaming monitor', NOW()),
(32, 1, 5, 14, 'Dell UltraSharp U3223QZ', 999.99, 'ACTIVE', '32" 4K USB-C monitor', NOW()),
(33, 1, 5, 16, 'Lenovo ThinkVision P32p-20', 799.99, 'ACTIVE', '32" 4K professional display', NOW()),
(34, 1, 5, 15, 'HP EliteDisplay E344c', 699.99, 'ACTIVE', '34" curved business monitor', NOW()),
(35, 1, 5, 7, 'Corsair Xeneon 32QHD165', 799.99, 'ACTIVE', '32" QHD gaming monitor', NOW()),

-- HDD (36-42)
(36, 1, 6, 9, 'WD Black 4TB HDD', 129.99, 'ACTIVE', '7200RPM high-performance hard drive', NOW()),
(37, 1, 6, 10, 'Seagate IronWolf 8TB NAS HDD', 299.99, 'ACTIVE', 'NAS-optimized hard drive', NOW()),
(38, 1, 6, 8, 'Samsung 870 EVO 2TB SSD', 199.99, 'ACTIVE', 'SATA SSD for laptops and desktops', NOW()),
(39, 1, 6, 9, 'WD Blue 1TB HDD', 59.99, 'ACTIVE', 'Reliable storage for everyday use', NOW()),
(40, 1, 6, 10, 'Seagate Barracuda 5TB HDD', 149.99, 'ACTIVE', 'High-capacity storage solution', NOW()),
(41, 1, 6, 8, 'Samsung 980 Pro 2TB NVMe', 249.99, 'ACTIVE', 'Gen4 NVMe SSD for gaming', NOW()),
(42, 1, 6, 7, 'Corsair MP600 2TB NVMe', 279.99, 'ACTIVE', 'High-speed Gen4 NVMe SSD', NOW()),

-- UPC Scan (43-49)
(43, 1, 7, 13, 'Logitech Zebra DS2208', 349.99, 'ACTIVE', 'USB barcode scanner with 1D/2D support', NOW()),
(44, 1, 7, 12, 'Razer Commerce Scanner', 499.99, 'ACTIVE', 'Gaming-themed barcode scanner', NOW()),
(45, 1, 7, 1, 'ASUS Business Scanner Pro', 599.99, 'ACTIVE', 'Professional document scanner', NOW()),
(46, 1, 7, 2, 'MSI Retail Scanner', 399.99, 'ACTIVE', 'Point-of-sale barcode scanner', NOW()),
(47, 1, 7, 8, 'Samsung Barcode Scanner BIXOLON', 449.99, 'ACTIVE', 'Industrial-grade scanner', NOW()),
(48, 1, 7, 14, 'Dell Wyse Barcode Scanner', 549.99, 'ACTIVE', 'Enterprise barcode scanner', NOW()),
(49, 1, 7, 16, 'Lenovo Barcode Scanner', 379.99, 'ACTIVE', 'Business barcode scanner', NOW()),

-- Tools (50-56)
(50, 1, 8, 11, 'Cooler Master Toolkit', 89.99, 'ACTIVE', 'Complete PC building toolkit', NOW()),
(51, 1, 8, 7, 'Corsair PC Building Kit', 119.99, 'ACTIVE', 'Professional PC assembly tools', NOW()),
(52, 1, 8, 13, 'Logitech Precision Screwdriver Set', 49.99, 'ACTIVE', 'Magnetic screwdriver set for electronics', NOW()),
(53, 1, 8, 12, 'Razer Repair Toolkit', 79.99, 'ACTIVE', 'Gaming device repair tools', NOW()),
(54, 1, 8, 1, 'ASUS Diagnostic Tools', 199.99, 'ACTIVE', 'Professional hardware diagnostic kit', NOW()),
(55, 1, 8, 2, 'MSI Maintenance Tools', 149.99, 'ACTIVE', 'PC maintenance and cleaning kit', NOW()),
(56, 1, 8, 8, 'Samsung Repair Tools', 129.99, 'ACTIVE', 'Mobile device repair toolkit', NOW());

-- Insert Inventory for all products (56 products)
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
(1, 49, 4, NOW()), (1, 50, 8, NOW()), (1, 51, 12, NOW()), (1, 52, 18, NOW()),
(1, 53, 6, NOW()), (1, 54, 10, NOW()), (1, 55, 15, NOW()), (1, 56, 9, NOW());

-- Insert Product Images (main images for 56 products)
INSERT INTO product_image (product_id, image_url, is_main) VALUES
(1, 'https://placehold.co/600x400', 1), (2, 'https://placehold.co/600x400', 1),
(3, 'https://placehold.co/600x400', 1), (4, 'https://placehold.co/600x400', 1),
(5, 'https://placehold.co/600x400', 1), (6, 'https://placehold.co/600x400', 1),
(7, 'https://placehold.co/600x400', 1), (8, 'https://placehold.co/600x400', 1),
(9, 'https://placehold.co/600x400', 1), (10, 'https://placehold.co/600x400', 1),
(11, 'https://placehold.co/600x400', 1), (12, 'https://placehold.co/600x400', 1),
(13, 'https://placehold.co/600x400', 1), (14, 'https://placehold.co/600x400', 1),
(15, 'https://placehold.co/600x400', 1), (16, 'https://placehold.co/600x400', 1),
(17, 'https://placehold.co/600x400', 1), (18, 'https://placehold.co/600x400', 1),
(19, 'https://placehold.co/600x400', 1), (20, 'https://placehold.co/600x400', 1),
(21, 'https://placehold.co/600x400', 1), (22, 'https://placehold.co/600x400', 1),
(23, 'https://placehold.co/600x400', 1), (24, 'https://placehold.co/600x400', 1),
(25, 'https://placehold.co/600x400', 1), (26, 'https://placehold.co/600x400', 1),
(27, 'https://placehold.co/600x400', 1), (28, 'https://placehold.co/600x400', 1),
(29, 'https://placehold.co/600x400', 1), (30, 'https://placehold.co/600x400', 1),
(31, 'https://placehold.co/600x400', 1), (32, 'https://placehold.co/600x400', 1),
(33, 'https://placehold.co/600x400', 1), (34, 'https://placehold.co/600x400', 1),
(35, 'https://placehold.co/600x400', 1), (36, 'https://placehold.co/600x400', 1),
(37, 'https://placehold.co/600x400', 1), (38, 'https://placehold.co/600x400', 1),
(39, 'https://placehold.co/600x400', 1), (40, 'https://placehold.co/600x400', 1),
(41, 'https://placehold.co/600x400', 1), (42, 'https://placehold.co/600x400', 1),
(43, 'https://placehold.co/600x400', 1), (44, 'https://placehold.co/600x400', 1),
(45, 'https://placehold.co/600x400', 1), (46, 'https://placehold.co/600x400', 1),
(47, 'https://placehold.co/600x400', 1), (48, 'https://placehold.co/600x400', 1),
(49, 'https://placehold.co/600x400', 1), (50, 'https://placehold.co/600x400', 1),
(51, 'https://placehold.co/600x400', 1), (52, 'https://placehold.co/600x400', 1),
(53, 'https://placehold.co/600x400', 1), (54, 'https://placehold.co/600x400', 1),
(55, 'https://placehold.co/600x400', 1), (56, 'https://placehold.co/600x400', 1);

-- Insert Sample Reviews with Different Ratings for New Categories
INSERT INTO review (user_id, product_id, rating, comment, created_at) VALUES
-- 5-star reviews for Laptop category
(1, 1, 5, 'Excellent laptop! Fast performance and beautiful display. Highly recommend for professionals.', NOW()),
(2, 3, 5, 'Best gaming laptop! Runs all games at max settings.', NOW()),
(3, 2, 5, 'Perfect business laptop, premium build quality!', NOW()),

-- 5-star reviews for Headset category
(4, 9, 5, 'Amazing gaming headset! THX spatial audio is incredible.', NOW()),
(5, 10, 5, 'Professional headset with crystal clear microphone!', NOW()),

-- 5-star reviews for Phone category
(1, 15, 5, 'Best Android phone! S Pen is amazing for productivity.', NOW()),
(2, 17, 5, 'Gaming phone with incredible performance!', NOW()),

-- 5-star reviews for TV category
(3, 23, 5, 'Stunning QLED TV! HDR10+ colors are perfect.', NOW()),
(4, 25, 5, 'Large gaming monitor with 144Hz is incredible!', NOW()),

-- 5-star reviews for Display category
(5, 29, 5, 'Professional 4K monitor! Perfect for design work.', NOW()),
(1, 31, 5, 'Super ultrawide gaming monitor is immersive!', NOW()),

-- 5-star reviews for HDD category
(2, 36, 5, 'Reliable hard drive! Great for storage expansion.', NOW()),
(3, 41, 5, 'Lightning fast NVMe SSD! Boot time is under 10 seconds.', NOW()),

-- 5-star reviews for UPC Scan category
(4, 43, 5, 'Excellent barcode scanner! 1D/2D support is perfect.', NOW()),
(5, 44, 5, 'Gaming-themed scanner works great for retail!', NOW()),

-- 5-star reviews for Tools category
(1, 50, 5, 'Complete PC building toolkit! Has everything I need.', NOW()),
(2, 51, 5, 'Professional tools for PC assembly!', NOW()),

-- 4-star reviews
(3, 4, 4, 'Great content creation laptop, 4K display is beautiful.', NOW()),
(4, 11, 4, 'Good wireless headset, ANC works well.', NOW()),
(5, 16, 4, 'Business smartphone with enterprise features.', NOW()),
(1, 24, 4, 'Professional 4K monitor for office work.', NOW()),
(2, 30, 4, 'Ultrawide monitor, great for multitasking.', NOW()),
(3, 37, 4, 'NAS-optimized hard drive, reliable storage.', NOW()),
(4, 42, 4, 'High-speed Gen4 NVMe SSD for gaming.', NOW()),
(5, 45, 4, 'Professional document scanner, fast scanning.', NOW()),
(1, 52, 4, 'Magnetic screwdriver set, great for electronics.', NOW()),

-- 3-star reviews
(2, 5, 3, 'Decent convertible laptop, battery life could be better.', NOW()),
(3, 12, 4, 'Wireless gaming headset with vibration is cool.', NOW()),
(4, 18, 3, 'Gaming phone with dual batteries, heavy though.', NOW()),
(5, 26, 3, 'Curved gaming monitor, takes getting used to.', NOW()),
(1, 32, 3, '4K professional display, good for business.', NOW()),
(2, 38, 3, 'SATA SSD is reliable but slower than NVMe.', NOW()),
(3, 46, 3, 'Point-of-sale scanner, works as expected.', NOW()),
(4, 53, 3, 'Gaming device repair tools, decent quality.', NOW()),

-- 2-star reviews
(5, 6, 2, 'Ultrabook with OLED display, overpriced for specs.', NOW()),
(1, 13, 2, 'True wireless earbuds, battery life is poor.', NOW()),
(2, 19, 2, 'Premium business hybrid, not worth the price.', NOW()),
(3, 27, 2, 'Business display with video conferencing, limited features.', NOW()),
(4, 33, 2, 'Super ultrawide monitor, too expensive.', NOW()),
(5, 39, 2, 'Reliable storage, but slow compared to modern drives.', NOW()),
(1, 47, 2, 'Industrial-grade scanner, complicated setup.', NOW()),
(2, 54, 2, 'Hardware diagnostic kit, software is buggy.', NOW()),

-- 1-star reviews
(3, 7, 1, 'Affordable laptop, poor build quality, hinge broke.', NOW()),
(4, 14, 1, 'Gaming laptop with AMD processor, overheating issues.', NOW()),
(5, 20, 1, 'Android tablet, slow performance for the price.', NOW()),
(1, 28, 1, 'Gaming monitor with 1ms response, terrible colors.', NOW()),
(2, 34, 1, 'Curved business monitor, backlight bleed issues.', NOW()),
(3, 40, 1, 'High-capacity storage, failed after 1 month.', NOW()),
(4, 48, 1, 'Enterprise barcode scanner, poor customer support.', NOW()),
(5, 55, 1, 'PC maintenance kit, tools broke easily.', NOW()),

-- Additional mixed reviews for testing
(1, 8, 4, 'Gaming laptop with AMD processor, good value.', NOW()),
(2, 21, 3, 'Handheld gaming device, innovative but heavy.', NOW()),
(3, 22, 3, 'Premium Android tablet, great for productivity.', NOW()),
(4, 35, 4, 'QHD gaming monitor, excellent performance.', NOW()),
(5, 49, 3, 'Business barcode scanner, gets the job done.', NOW()),
(1, 56, 4, 'Mobile device repair toolkit, comprehensive set.', NOW());

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
