SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- 1. ROLE
-- =========================
INSERT INTO role (id, name) VALUES
                                (1, 'ADMIN'),
                                (2, 'USER');

-- =========================
-- 2. USER
-- =========================
-- Note: Users are now inserted in tech_store_sample_data.sql
-- INSERT INTO user (id, username, email, password, full_name, phone_number, status) VALUES
--                                                                                      (1, 'admin', 'admin@test.com', 'hashed_password', 'Admin User', '0900000001', 'ACTIVE'),
--                                                                                      (2, 'john', 'john@test.com', 'hashed_password', 'John Doe', '0900000002', 'ACTIVE');

-- =========================
-- 3. USER_ROLE
-- =========================
-- Note: User roles are now inserted in tech_store_sample_data.sql
-- INSERT INTO user_role (user_id, role_id) VALUES
--                                              (1, 1),
--                                              (2, 2);

-- =========================
-- 4. STORE
-- =========================
-- Note: Store is now inserted in tech_store_sample_data.sql
-- INSERT INTO store (id, name, description, owner_id, status) VALUES
--     (1, 'Tech Store', 'Electronics & Gadgets', 1, 'ACTIVE');

-- =========================
-- 5. CATEGORY
-- =========================
INSERT INTO category (id, name, parent_id) VALUES
                                               (1, 'Electronics', NULL),
                                               (2, 'Laptop', 1),
                                               (3, 'Accessories', 1);

-- =========================
-- 6. BRAND
-- =========================
INSERT INTO brand (id, name) VALUES
                                 (1, 'Apple'),
                                 (2, 'Dell');

-- =========================
-- 7. PRODUCT
-- =========================
INSERT INTO product (
    id, store_id, category_id, brand_id, name, price, status, description
) VALUES
      (1, 1, 2, 2, 'Dell XPS 13', 25000000, 'ACTIVE', 'Premium ultrabook'),
      (2, 1, 3, 1, 'Apple Magic Mouse', 2000000, 'ACTIVE', 'Wireless mouse');

-- =========================
-- 8. PRODUCT_IMAGE
-- =========================
INSERT INTO product_image (id, product_id, image_url, is_main) VALUES
                                                                   (1, 1, 'https://img.test/dell-xps.jpg', 1),
                                                                   (2, 2, 'https://img.test/magic-mouse.jpg', 1);

-- =========================
-- 9. PRODUCT_SPEC
-- =========================
INSERT INTO product_spec (id, product_id, spec_key, spec_value) VALUES
                                                                    (1, 1, 'CPU', 'Intel i7'),
                                                                    (2, 1, 'RAM', '16GB'),
                                                                    (3, 2, 'Color', 'White');

-- =========================
-- 10. INVENTORY
-- =========================
INSERT INTO inventory (id, store_id, product_id, quantity) VALUES
                                                               (1, 1, 1, 10),
                                                               (2, 1, 2, 50);

-- =========================
-- 11. CART
-- =========================
INSERT INTO cart (id, user_id) VALUES
    (1, 2);

-- =========================
-- 12. CART_ITEM
-- =========================
INSERT INTO cart_item (id, cart_id, product_id, store_id, quantity, price) VALUES
                                                                               (1, 1, 1, 1, 1, 25000000),
                                                                               (2, 1, 2, 1, 2, 2000000);

-- =========================
-- 13. ORDER
-- =========================
INSERT INTO `order` (id, user_id, total_price, status, shipping_address) VALUES
    (1, 2, 29000000, 'PAID', '123 Le Loi, Da Nang');

-- =========================
-- 14. ORDER_ITEM
-- =========================
INSERT INTO order_item (id, order_id, product_id, store_id, price, quantity) VALUES
                                                                                 (1, 1, 1, 1, 25000000, 1),
                                                                                 (2, 1, 2, 1, 2000000, 2);

-- =========================
-- 15. PAYMENT
-- =========================
INSERT INTO payment (id, order_id, method, status, transaction_id) VALUES
    (1, 1, 'COD', 'SUCCESS', 'TXN123456');

-- =========================
-- 16. STORE_COMMISSION
-- =========================
INSERT INTO store_commission (id, store_id, commission_rate, effective_from) VALUES
    (1, 1, 10.00, '2025-01-01');

-- =========================
-- 17. REVIEW
-- =========================
INSERT INTO review (id, user_id, product_id, order_id, rating, comment) VALUES
                                                                            (1, 2, 1, 1, 5, 'Very good laptop'),
                                                                            (2, 2, 2, 1, 4, 'Nice mouse');

SET FOREIGN_KEY_CHECKS = 1;
