-- =========================
-- 1. Role & User
-- =========================
CREATE TABLE role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone_number VARCHAR(50),
    status VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE user_role (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_role_user
        FOREIGN KEY (user_id) REFERENCES user(id),
    CONSTRAINT fk_user_role_role
        FOREIGN KEY (role_id) REFERENCES role(id)
) ENGINE=InnoDB;

-- =========================
-- 2. Stores
-- =========================
CREATE TABLE store (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id BIGINT NOT NULL,
    status VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_store_owner
        FOREIGN KEY (owner_id) REFERENCES user(id)
) ENGINE=InnoDB;

-- =========================
-- 3. Category & Brand
-- =========================
CREATE TABLE category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    parent_id BIGINT,
    CONSTRAINT fk_category_parent
        FOREIGN KEY (parent_id) REFERENCES category(id)
) ENGINE=InnoDB;

CREATE TABLE brand (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- =========================
-- 4. Product + Image + Spec
-- =========================
CREATE TABLE product (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    brand_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    status VARCHAR(20),
    description LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_store
        FOREIGN KEY (store_id) REFERENCES store(id),
    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id) REFERENCES category(id),
    CONSTRAINT fk_product_brand
        FOREIGN KEY (brand_id) REFERENCES brand(id)
) ENGINE=InnoDB;

CREATE TABLE product_image (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_product_image_product
        FOREIGN KEY (product_id) REFERENCES product(id)
) ENGINE=InnoDB;

CREATE TABLE product_spec (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    spec_key VARCHAR(255),
    spec_value VARCHAR(255),
    CONSTRAINT fk_product_spec_product
        FOREIGN KEY (product_id) REFERENCES product(id)
) ENGINE=InnoDB;

-- =========================
-- 5. Inventory
-- =========================
CREATE TABLE inventory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventory_store
        FOREIGN KEY (store_id) REFERENCES store(id),
    CONSTRAINT fk_inventory_product
        FOREIGN KEY (product_id) REFERENCES product(id),
    UNIQUE (store_id, product_id)
) ENGINE=InnoDB;

-- =========================
-- 6. Order + Order_Item
-- =========================
CREATE TABLE `order` (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    status VARCHAR(30),
    shipping_address VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user
        FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB;

CREATE TABLE order_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    store_id BIGINT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    quantity INT NOT NULL,
    CONSTRAINT fk_order_item_order
        FOREIGN KEY (order_id) REFERENCES `order`(id),
    CONSTRAINT fk_order_item_product
        FOREIGN KEY (product_id) REFERENCES product(id),
    CONSTRAINT fk_order_item_store
        FOREIGN KEY (store_id) REFERENCES store(id)
) ENGINE=InnoDB;

-- =========================
-- 7. Payment
-- =========================
CREATE TABLE payment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    method VARCHAR(50),
    status VARCHAR(30),
    transaction_id VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_order
        FOREIGN KEY (order_id) REFERENCES `order`(id)
) ENGINE=InnoDB;

-- =========================
-- 8. Store_Commission
-- =========================
CREATE TABLE store_commission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_id BIGINT NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    effective_from DATE NOT NULL,
    CONSTRAINT fk_store_commission_store
        FOREIGN KEY (store_id) REFERENCES store(id)
) ENGINE=InnoDB;

-- =========================
-- 8. Cart
-- =========================
CREATE TABLE cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_user
        FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB;

CREATE TABLE cart_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    store_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_cart_item_cart
        FOREIGN KEY (cart_id) REFERENCES cart(id),
    CONSTRAINT fk_cart_item_product
        FOREIGN KEY (product_id) REFERENCES product(id),
    CONSTRAINT fk_cart_item_store
        FOREIGN KEY (store_id) REFERENCES store(id),
    UNIQUE (cart_id, product_id, store_id)
) ENGINE=InnoDB;

-- =========================
-- 10. Review
-- =========================
CREATE TABLE review (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    order_id BIGINT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id) REFERENCES user(id),
    CONSTRAINT fk_review_product
        FOREIGN KEY (product_id) REFERENCES product(id),
    CONSTRAINT fk_review_order
        FOREIGN KEY (order_id) REFERENCES `order`(id),
    UNIQUE (user_id, product_id, order_id)
) ENGINE=InnoDB;
