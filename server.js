const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'hasl-sneakers-secret-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'hasl_sneakers',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize database tables
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // Create Users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                address VARCHAR(255),
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create Products table
        await connection.execute(`
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
            )
        `);
        
        // Create Product Sizes table with stock quantity
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS product_sizes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                size INT NOT NULL,
                quantity INT NOT NULL DEFAULT 10,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                UNIQUE KEY product_size (product_id, size)
            )
        `);
        
        // Create Orders table
        await connection.execute(`
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
            )
        `);
        
        // Create Order Items table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                name VARCHAR(100) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                quantity INT NOT NULL,
                size INT NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            )
        `);
        
        // Create Receipts table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS receipts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                receipt_html TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            )
        `);
        
        // Create Messages table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        connection.release();
        console.log('Database tables initialized');
        
        // Initialize products if none exist
        await initializeProducts();
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

// Initialize products
async function initializeProducts() {
    try {
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM products');
        if (rows[0].count === 0) {
            const products = [
                {
                    product_id: 1,
                    name: 'Nike Air Max 97',
                    brand: 'Nike',
                    price: 15990,
                    color: 'Серебряный',
                    popular: true,
                    is_new: false,
                    image: '<img src="Nike AIR max 97.png" alt="Nike Air Max 97">',
                    sizes: [40, 41, 42, 43, 44, 45]
                },
                {
                    product_id: 2,
                    name: 'Air Jordan 4 Retro',
                    brand: 'Jordan',
                    price: 21990,
                    color: 'Черный/Белый',
                    popular: true,
                    is_new: true,
                    image: '<img src="Nike Air Jordan 4.png" alt="Air Jordan 4 Retro">',
                    sizes: [39, 40, 41, 42, 43, 44, 45]
                },
                {
                    product_id: 3,
                    name: 'Vans Old Skool',
                    brand: 'Vans',
                    price: 6990,
                    color: 'Черный',
                    popular: true,
                    is_new: false,
                    image: '<img src="Vans old school.png" alt="Vans Old Skool">',
                    sizes: [36, 37, 38, 39, 40, 41, 42]
                },
                {
                    product_id: 4,
                    name: 'Adidas Ozweego',
                    brand: 'Adidas',
                    price: 12990,
                    color: 'Красный/Серебряный',
                    popular: false,
                    is_new: true,
                    image: '<img src="RAF SIMONS OZWEGO.png" alt="Adidas Ozweego">',
                    sizes: [40, 41, 42, 43, 44, 45, 46]
                },
                {
                    product_id: 5,
                    name: 'Air Jordan 5 Retro',
                    brand: 'Jordan',
                    price: 19990,
                    color: 'Оранжевый',
                    popular: true,
                    is_new: true,
                    image: '<img src="Nike Air Jordan 5.png" alt="Air Jordan 5 Retro">',
                    sizes: [41, 42, 43, 44, 45]
                },
                {
                    product_id: 6,
                    name: 'Balenciaga Track',
                    brand: 'Balenciaga',
                    price: 89990,
                    color: 'Черный',
                    popular: false,
                    is_new: true,
                    image: '<img src="Balenciaga track.png" alt="Balenciaga Track">',
                    sizes: [39, 40, 41, 42, 43, 44]
                },
                {
                    product_id: 7,
                    name: 'New Balance 2002R',
                    brand: 'New Balance',
                    price: 17990,
                    color: 'Оранжевый/Желтый',
                    popular: false,
                    is_new: true,
                    image: '<img src="Salehe Bembury X New Balance 2002R Peace Be.png" alt="New Balance 2002R">',
                    sizes: [40, 41, 42, 43, 44, 45]
                },
                {
                    product_id: 8,
                    name: 'Air Jordan 11 Retro',
                    brand: 'Jordan',
                    price: 22990,
                    color: 'Черный/Белый',
                    popular: true,
                    is_new: false,
                    image: '<img src="Jordan 11 retro.png" alt="Air Jordan 11 Retro">',
                    sizes: [40, 41, 42, 43, 44, 45]
                },
                {
                    product_id: 9,
                    name: 'Nike Dunk Low',
                    brand: 'Nike',
                    price: 10990,
                    color: 'Черный/Белый',
                    popular: true,
                    is_new: false,
                    image: '<img src="Nike Dunk low.png" alt="Nike Dunk Low">',
                    sizes: [38, 39, 40, 41, 42, 43]
                }
            ];
            
            for (const product of products) {
                // Insert product
                const [result] = await pool.execute(
                    'INSERT INTO products (product_id, name, brand, price, color, popular, is_new, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [product.product_id, product.name, product.brand, product.price, product.color, product.popular, product.is_new, product.image]
                );
                
                // Insert product sizes with random quantity between 5 and 20
                for (const size of product.sizes) {
                    const quantity = Math.floor(Math.random() * 16) + 5; // Random between 5 and 20
                    await pool.execute(
                        'INSERT INTO product_sizes (product_id, size, quantity) VALUES (?, ?, ?)',
                        [result.insertId, size, quantity]
                    );
                }
            }
            
            console.log('Products initialized');
        }
    } catch (error) {
        console.error('Error initializing products:', error);
    }
}

// Configure mail transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.example.com', // Replace with your SMTP server
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'info@hasl-shoes.ru', // Replace with your email
        pass: 'password123' // Replace with your password
    }
});

// Auth middleware
function authMiddleware(req, res, next) {
    const token = req.header('x-auth-token');
    
    if (!token) {
        return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Недействительный токен' });
    }
}

// Routes
// 1. Authentication
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length > 0) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        await pool.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        
        res.status(201).json({ message: 'Регистрация успешна' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }
        
        const user = users[0];
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }
        
        // Create token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// 2. Products
app.get('/api/products', async (req, res) => {
    try {
        const { brand, price, sort } = req.query;
        
        let query = `
            SELECT p.*, 
                   GROUP_CONCAT(ps.size) as sizes,
                   GROUP_CONCAT(ps.quantity) as quantities
            FROM products p
            LEFT JOIN product_sizes ps ON p.id = ps.product_id
        `;
        
        const queryParams = [];
        let whereClause = [];
        
        // Filter by brand
        if (brand && brand !== 'all') {
            whereClause.push('p.brand LIKE ?');
            queryParams.push(`%${brand}%`);
        }
        
        // Filter by price
        if (price) {
            if (price === 'low') {
                whereClause.push('p.price < ?');
                queryParams.push(10000);
            } else if (price === 'medium') {
                whereClause.push('p.price >= ? AND p.price <= ?');
                queryParams.push(10000, 20000);
            } else if (price === 'high') {
                whereClause.push('p.price > ?');
                queryParams.push(20000);
            }
        }
        
        if (whereClause.length > 0) {
            query += ' WHERE ' + whereClause.join(' AND ');
        }
        
        query += ' GROUP BY p.id';
        
        // Sort options
        if (sort) {
            if (sort === 'price-low') {
                query += ' ORDER BY p.price ASC';
            } else if (sort === 'price-high') {
                query += ' ORDER BY p.price DESC';
            } else if (sort === 'popular') {
                query += ' ORDER BY p.popular DESC';
            } else if (sort === 'new') {
                query += ' ORDER BY p.is_new DESC';
            }
        }
        
        const [products] = await pool.execute(query, queryParams);
        
        // Format sizes and quantities
        const formattedProducts = products.map(product => {
            const sizes = product.sizes ? product.sizes.split(',').map(Number) : [];
            const quantities = product.quantities ? product.quantities.split(',').map(Number) : [];
            
            const inventory = {};
            sizes.forEach((size, index) => {
                inventory[size] = quantities[index];
            });
            
            return {
                ...product,
                sizes,
                inventory
            };
        });
        
        res.json(formattedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const [products] = await pool.execute(`
            SELECT p.*, 
                   GROUP_CONCAT(ps.size) as sizes,
                   GROUP_CONCAT(ps.quantity) as quantities
            FROM products p
            LEFT JOIN product_sizes ps ON p.id = ps.product_id
            WHERE p.product_id = ?
            GROUP BY p.id
        `, [req.params.id]);
        
        if (products.length === 0) {
            return res.status(404).json({ message: 'Товар не найден' });
        }
        
        const product = products[0];
        const sizes = product.sizes ? product.sizes.split(',').map(Number) : [];
        const quantities = product.quantities ? product.quantities.split(',').map(Number) : [];
        
        const inventory = {};
        sizes.forEach((size, index) => {
            inventory[size] = quantities[index];
        });
        
        product.sizes = sizes;
        product.inventory = inventory;
        
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// 3. Orders
app.post('/api/orders', authMiddleware, async (req, res) => {
    try {
        const { items, totalPrice, shippingAddress, paymentMethod, contact } = req.body;
        const userId = req.user.id;
        
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // Create order
            const [orderResult] = await connection.execute(`
                INSERT INTO orders (user_id, total_price, shipping_city, shipping_address, shipping_postcode, payment_method)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [userId, totalPrice, shippingAddress.city, shippingAddress.address, shippingAddress.postcode, paymentMethod]);
            
            const orderId = orderResult.insertId;
            
            // Create order items and update inventory
            for (const item of items) {
                await connection.execute(`
                    INSERT INTO order_items (order_id, product_id, name, price, quantity, size)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [orderId, item.productId, item.name, item.price, item.quantity, item.size]);
                
                // Find product in DB
                const [products] = await connection.execute(
                    'SELECT id FROM products WHERE product_id = ?',
                    [item.productId]
                );
                
                if (products.length > 0) {
                    // Update inventory quantity
                    await connection.execute(
                        'UPDATE product_sizes SET quantity = quantity - ? WHERE product_id = ? AND size = ?',
                        [item.quantity, products[0].id, item.size]
                    );
                }
            }
            
            await connection.commit();
            
            // Generate receipt
            const receipt = generateReceiptHTML(orderId, items, totalPrice, shippingAddress, paymentMethod, contact);
            
            // Store receipt in database
            await pool.execute(
                'INSERT INTO receipts (order_id, receipt_html) VALUES (?, ?)',
                [orderId, receipt]
            );
            
            res.status(201).json({
                message: 'Заказ успешно создан',
                orderId: orderId
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

app.get('/api/orders', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get orders
        const [orders] = await pool.execute(`
            SELECT * FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC
        `, [userId]);
        
        // Get order items for each order
        for (const order of orders) {
            const [items] = await pool.execute(`
                SELECT * FROM order_items
                WHERE order_id = ?
            `, [order.id]);
            
            order.items = items;
        }
        
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

app.get('/api/orders/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get order
        const [orders] = await pool.execute(`
            SELECT * FROM orders
            WHERE id = ? AND user_id = ?
        `, [req.params.id, userId]);
        
        if (orders.length === 0) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }
        
        const order = orders[0];
        
        // Get order items
        const [items] = await pool.execute(`
            SELECT * FROM order_items
            WHERE order_id = ?
        `, [order.id]);
        
        order.items = items;
        
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Email receipt route
app.post('/api/send-receipt', authMiddleware, async (req, res) => {
    try {
        const { email, orderId } = req.body;
        const userId = req.user.id;
        
        // Check if the order belongs to the user
        const [orders] = await pool.execute(
            'SELECT id FROM orders WHERE id = ? AND user_id = ?',
            [orderId, userId]
        );
        
        if (orders.length === 0) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }
        
        // Get receipt from database
        const [receipts] = await pool.execute(
            'SELECT receipt_html FROM receipts WHERE order_id = ?',
            [orderId]
        );
        
        if (receipts.length === 0) {
            return res.status(404).json({ message: 'Чек не найден' });
        }
        
        // Send email with receipt
        const info = await transporter.sendMail({
            from: '"HASL Sneakers" <info@hasl-shoes.ru>',
            to: email,
            subject: `Ваш заказ №${orderId} в HASL Sneakers`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Спасибо за ваш заказ в HASL Sneakers!</h2>
                    <p>Уважаемый клиент, ваш заказ №${orderId} успешно оформлен.</p>
                    <p>К этому письму прикреплен чек вашего заказа.</p>
                    <p>С уважением,<br>Команда HASL Sneakers</p>
                </div>
            `,
            attachments: [
                {
                    filename: `receipt-order-${orderId}.html`,
                    content: receipts[0].receipt_html,
                    contentType: 'text/html'
                }
            ]
        });
        
        res.json({ message: 'Чек успешно отправлен на почту' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Ошибка при отправке чека' });
    }
});

// 4. Contact messages
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        await pool.execute(`
            INSERT INTO messages (name, email, message)
            VALUES (?, ?, ?)
        `, [name, email, message]);
        
        res.status(201).json({ message: 'Сообщение успешно отправлено' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// 5. User profile
app.get('/api/user', authMiddleware, async (req, res) => {
    try {
        const [users] = await pool.execute('SELECT id, name, email, address, phone, created_at FROM users WHERE id = ?', [req.user.id]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        
        res.json(users[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

app.put('/api/user', authMiddleware, async (req, res) => {
    try {
        const { name, address, phone } = req.body;
        
        await pool.execute(
            'UPDATE users SET name = ?, address = ?, phone = ? WHERE id = ?',
            [name, address, phone, req.user.id]
        );
        
        res.json({ message: 'Профиль успешно обновлен' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Function to generate receipt HTML content
function generateReceiptHTML(orderId, items, totalPrice, shippingAddress, paymentMethod, contact) {
    // Format date
    const date = new Date();
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 10000 ? 0 : 500;
    
    // Generate HTML receipt
    let receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Чек заказа №${orderId}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .receipt {
                    border: 1px solid #ddd;
                    padding: 20px;
                    border-radius: 5px;
                }
                .receipt-header {
                    text-align: center;
                    margin-bottom: 20px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #ddd;
                }
                .receipt-info {
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: space-between;
                }
                .receipt-items {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                .receipt-items th, .receipt-items td {
                    padding: 10px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                .receipt-items th {
                    background-color: #f9f9f9;
                }
                .receipt-total {
                    margin-top: 20px;
                    text-align: right;
                }
                .receipt-footer {
                    margin-top: 30px;
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="receipt">
                <div class="receipt-header">
                    <h1>HASL Sneakers</h1>
                    <p>Ваш чек на заказ</p>
                </div>
                
                <div class="receipt-info">
                    <div>
                        <p><strong>Номер заказа:</strong> ${orderId}</p>
                        <p><strong>Дата:</strong> ${formattedDate}</p>
                        <p><strong>Время:</strong> ${formattedTime}</p>
                    </div>
                    <div>
                        <p><strong>Покупатель:</strong> ${contact.fullname}</p>
                        <p><strong>Email:</strong> ${contact.email}</p>
                        <p><strong>Телефон:</strong> ${contact.phone}</p>
                    </div>
                </div>
                
                <h3>Товары</h3>
                <table class="receipt-items">
                    <thead>
                        <tr>
                            <th>Наименование</th>
                            <th>Размер</th>
                            <th>Кол-во</th>
                            <th>Цена</th>
                            <th>Сумма</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // Add items to receipt
    items.forEach(item => {
        receiptHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.size}</td>
                <td>${item.quantity}</td>
                <td>${formatPrice(item.price)} ₽</td>
                <td>${formatPrice(item.price * item.quantity)} ₽</td>
            </tr>
        `;
    });
    
    // Add totals
    receiptHTML += `
                    </tbody>
                </table>
                
                <div class="receipt-total">
                    <p><strong>Товары на сумму:</strong> ${formatPrice(subtotal)} ₽</p>
                    <p><strong>Доставка:</strong> ${shipping === 0 ? 'Бесплатно' : formatPrice(shipping) + ' ₽'}</p>
                    <p><strong>Итого к оплате:</strong> ${formatPrice(totalPrice)} ₽</p>
                    <p><strong>Способ оплаты:</strong> ${paymentMethod === 'card' ? 'Банковская карта' : 'Наличными при получении'}</p>
                </div>
                
                <div class="receipt-footer">
                    <p>Спасибо за покупку в HASL Sneakers!</p>
                    <p>При возникновении вопросов обращайтесь по телефону: +7 (999) 123-45-67</p>
                    <p>или по email: info@hasl-shoes.ru</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    return receiptHTML;
}

// Helper function to format prices
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Add route to get receipt by order ID
app.get('/api/receipts/:orderId', authMiddleware, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const userId = req.user.id;
        
        // Check if the order belongs to the user
        const [orders] = await pool.execute(
            'SELECT id FROM orders WHERE id = ? AND user_id = ?',
            [orderId, userId]
        );
        
        if (orders.length === 0) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }
        
        // Get receipt from database
        const [receipts] = await pool.execute(
            'SELECT receipt_html FROM receipts WHERE order_id = ?',
            [orderId]
        );
        
        if (receipts.length === 0) {
            return res.status(404).json({ message: 'Чек не найден' });
        }
        
        res.send(receipts[0].receipt_html);
    } catch (error) {
        console.error('Error fetching receipt:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Serve static files and handle SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Initialize database on startup
initializeDatabase();