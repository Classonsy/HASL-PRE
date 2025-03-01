-- HASL Sneakers Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS hasl_sneakers;
USE hasl_sneakers;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    color VARCHAR(50),
    popular BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    image TEXT NOT NULL
);

-- Product Sizes table with stock quantity
CREATE TABLE IF NOT EXISTS product_sizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    size INT NOT NULL,
    quantity INT NOT NULL DEFAULT 10,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY product_size (product_id, size)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    shipping_postcode VARCHAR(20) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    size INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Receipts table
CREATE TABLE IF NOT EXISTS receipts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    receipt_html TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial product data
INSERT INTO products (product_id, name, brand, price, color, popular, is_new, image) VALUES
(1, 'Nike Air Max 97', 'Nike', 15990, 'Серебряный', TRUE, FALSE, '<img src="Nike AIR max 97.png" alt="Nike Air Max 97">'),
(2, 'Air Jordan 4 Retro', 'Jordan', 21990, 'Черный/Белый', TRUE, TRUE, '<img src="Nike Air Jordan 4.png" alt="Air Jordan 4 Retro">'),
(3, 'Vans Old Skool', 'Vans', 6990, 'Черный', TRUE, FALSE, '<img src="Vans old school.png" alt="Vans Old Skool">'),
(4, 'Adidas Ozweego', 'Adidas', 12990, 'Красный/Серебряный', FALSE, TRUE, '<img src="RAF SIMONS OZWEGO.png" alt="Adidas Ozweego">'),
(5, 'Air Jordan 5 Retro', 'Jordan', 19990, 'Оранжевый', TRUE, TRUE, '<img src="Nike Air Jordan 5.png" alt="Air Jordan 5 Retro">'),
(6, 'Balenciaga Track', 'Balenciaga', 89990, 'Черный', FALSE, TRUE, '<img src="Balenciaga track.png" alt="Balenciaga Track">'),
(7, 'New Balance 2002R', 'New Balance', 17990, 'Оранжевый/Желтый', FALSE, TRUE, '<img src="Salehe Bembury X New Balance 2002R Peace Be.png" alt="New Balance 2002R">'),
(8, 'Air Jordan 11 Retro', 'Jordan', 22990, 'Черный/Белый', TRUE, FALSE, '<img src="Jordan 11 retro.png" alt="Air Jordan 11 Retro">'),
(9, 'Nike Dunk Low', 'Nike', 10990, 'Черный/Белый', TRUE, FALSE, '<img src="Nike Dunk low.png" alt="Nike Dunk Low">');

-- Insert product sizes with inventory quantities
-- Get the product IDs first
SET @nikeAirMax97ID = (SELECT id FROM products WHERE product_id = 1);
SET @airJordan4ID = (SELECT id FROM products WHERE product_id = 2);
SET @vansOldSkoolID = (SELECT id FROM products WHERE product_id = 3);
SET @adidasOzweegoID = (SELECT id FROM products WHERE product_id = 4);
SET @airJordan5ID = (SELECT id FROM products WHERE product_id = 5);
SET @balenciagaTrackID = (SELECT id FROM products WHERE product_id = 6);
SET @newBalance2002rID = (SELECT id FROM products WHERE product_id = 7);
SET @airJordan11ID = (SELECT id FROM products WHERE product_id = 8);
SET @nikeDunkLowID = (SELECT id FROM products WHERE product_id = 9);

-- Insert sizes with random inventory between 5 and 20
-- Nike Air Max 97
INSERT INTO product_sizes (product_id, size, quantity) VALUES
(@nikeAirMax97ID, 40, FLOOR(5 + (RAND() * 16))),
(@nikeAirMax97ID, 41, FLOOR(5 + (RAND() * 16))),
(@nikeAirMax97ID, 42, FLOOR(5 + (RAND() * 16))),
(@nikeAirMax97ID, 43, FLOOR(5 + (RAND() * 16))),
(@nikeAirMax97ID, 44, FLOOR(5 + (RAND() * 16))),
(@nikeAirMax97ID, 45, FLOOR(5 + (RAND() * 16)));

-- Air Jordan 4 Retro
INSERT INTO product_sizes (product_id, size, quantity) VALUES
(@airJordan4ID, 39, FLOOR(5 + (RAND() * 16))),
(@airJordan4ID, 40, FLOOR(5 + (RAND() * 16))),
(@airJordan4ID, 41, FLOOR(5 + (RAND() * 16))),
(@airJordan4ID, 42, FLOOR(5 + (RAND() * 16))),
(@airJordan4ID, 43, FLOOR(5 + (RAND() * 16))),
(@airJordan4ID, 44, FLOOR(5 + (RAND() * 16))),
(@airJordan4ID, 45, FLOOR(5 + (RAND() * 16)));

-- Vans Old Skool
INSERT INTO product_sizes (product_id, size, quantity) VALUES
(@vansOldSkoolID, 36, FLOOR(5 + (RAND() * 16))),
(@vansOldSkoolID, 37, FLOOR(5 + (RAND() * 16))),
(@vansOldSkoolID, 38, FLOOR(5 + (RAND() * 16))),
(@vansOldSkoolID, 39, FLOOR(5 + (RAND() * 16))),
(@vansOldSkoolID, 40, FLOOR(5 + (RAND() * 16))),
(@vansOldSkoolID, 41, FLOOR(5 + (RAND() * 16))),
(@vansOldSkoolID, 42, FLOOR(5 + (RAND() * 16)));

-- Adidas Ozweego
INSERT INTO product_sizes (product_id, size, quantity) VALUES
(@adidasOzweegoID, 40, FLOOR(5 + (RAND() * 16))),
(@adidasOzweegoID, 41, FLOOR(5 + (RAND() * 16))),
(@adidasOzweegoID, 42, FLOOR(5 + (RAND() * 16))),
(@adidasOzweegoID, 43, FLOOR(5 + (RAND() * 16))),
(@adidasOzweegoID, 44, FLOOR(5 + (RAND() * 16))),
(@adidasOzweegoID, 45, FLOOR(5 + (RAND() * 16))),
(@adidasOzweegoID, 46, FLOOR(5 + (RAND() * 16)));

-- Air Jordan 5 Retro
INSERT INTO product_sizes (product_id, size, quantity) VALUES
(@airJordan5ID, 41, FLOOR(5 + (RAND() * 16))),
(@airJordan5ID, 42, FLOOR(5 + (RAND() * 16))),
(@airJordan5ID, 43, FLOOR(5 + (RAND() * 16))),
(@airJordan5ID, 44, FLOOR(5 + (RAND() * 16))),
(@airJordan5ID, 45, FLOOR(5 + (RAND() * 16)));

-- Balenciaga Track
INSERT INTO product_sizes (product_id, size, quantity) VALUES
(@balenciagaTrackID, 39, FLOOR(5 + (RAND() * 16))),
(@balenciagaTrackID, 40, FLOOR(5 + (RAND() * 16))),
(@balenciagaTrackID, 41, FLOOR(5 + (RAND() * 16))),
(@balenciagaTrackID, 42, FLOOR(5 + (RAND() * 16))),
(@balenciagaTrackID, 43, FLOOR(5 + (RAND() * 16))),
(@balenciagaTrackID, 44, FLOOR(5 + (RAND() * 16)));

-- New Balance 2002R
INSERT INTO product_sizes (product_id, size, quantity) VALUES
(@newBalance2002rID, 40, FLOOR(5 + (RAND() * 16))),
(@newBalance2002rID, 41, FLOOR(5 + (RAND() * 16))),
(@newBalance2002rID, 42, FLOOR(5 + (RAND() * 16))),
(@newBalance2002rID, 43, FLOOR(5 + (RAND() * 16))),
(@newBalance2002rID, 44, FLOOR(5 + (RAND() * 16))),
(@newBalance2002rID, 45, FLOOR(5 + (RAND() * 16)));

-- Air Jordan 11 Retro
INSERT INTO product_sizes (product_id, size, quantity) VALUES
(@airJordan11ID, 40, FLOOR(5 + (RAND() * 16))),
(@airJordan11ID, 41, FLOOR(5 + (RAND() * 16))),
(@airJordan11ID, 42, FLOOR(5 + (RAND() * 16))),
(@airJordan11ID, 43, FLOOR(5 + (RAND() * 16))),
(@airJordan11ID, 44, FLOOR(5 + (RAND() * 16))),
(@airJordan11ID, 45, FLOOR(5 + (RAND() * 16)));

-- Nike Dunk Low
INSERT INTO product_sizes (product_id, size, quantity) VALUES
(@nikeDunkLowID, 38, FLOOR(5 + (RAND() * 16))),
(@nikeDunkLowID, 39, FLOOR(5 + (RAND() * 16))),
(@nikeDunkLowID, 40, FLOOR(5 + (RAND() * 16))),
(@nikeDunkLowID, 41, FLOOR(5 + (RAND() * 16))),
(@nikeDunkLowID, 42, FLOOR(5 + (RAND() * 16))),
(@nikeDunkLowID, 43, FLOOR(5 + (RAND() * 16)));

-- Create a test user with hashed password (password: 'password123')
INSERT INTO users (name, email, password) VALUES 
('Test User', 'test@example.com', '$2a$10$VFyE5K2GhJDzl1X4RvxM9.5zUr6bS.0CG3A8MaANzJe6HhWm3Y5Ga');

