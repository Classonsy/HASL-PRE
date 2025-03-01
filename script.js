document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        // Animate menu toggle icon
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Cart functionality
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCount = document.querySelector('.cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    
    // Cart state
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count and total
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
        updateCartTotal();
    }
    
    // Update cart count
    function updateCartCount() {
        const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalCount;
    }
    
    // Update cart total price
    function updateCartTotal() {
        const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartTotalPrice.textContent = `${formatPrice(total)} ₽`;
    }
    
    // Format price with spaces
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    
    // Render cart items
    function renderCartItems() {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Ваша корзина пуста</p>
                </div>
            `;
            return;
        }
        
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    ${item.image}
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-brand">${item.brand}</div>
                    <div class="cart-item-size">Размер: ${item.size}</div>
                    <div class="cart-item-price">${formatPrice(item.price)} ₽</div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn decrease-btn" data-index="${index}">-</button>
                        <input type="number" class="cart-item-quantity" value="${item.quantity}" min="1" data-index="${index}">
                        <button class="quantity-btn increase-btn" data-index="${index}">+</button>
                        <button class="remove-from-cart" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    updateCart();
                }
            });
        });
        
        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                cart[index].quantity++;
                updateCart();
            });
        });
        
        document.querySelectorAll('.cart-item-quantity').forEach(input => {
            input.addEventListener('change', function() {
                const index = this.getAttribute('data-index');
                const quantity = parseInt(this.value);
                if (quantity >= 1) {
                    cart[index].quantity = quantity;
                    updateCart();
                } else {
                    this.value = 1;
                    cart[index].quantity = 1;
                    updateCart();
                }
            });
        });
        
        document.querySelectorAll('.remove-from-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                cart.splice(index, 1);
                updateCart();
            });
        });
    }
    
    // Show cart
    cartIcon.addEventListener('click', function() {
        cartModal.classList.add('active');
    });
    
    // Close cart
    closeCart.addEventListener('click', function() {
        cartModal.classList.remove('active');
    });
    
    // Clear cart
    clearCartBtn.addEventListener('click', function() {
        cart = [];
        updateCart();
    });
    
    // Checkout
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Ваша корзина пуста');
            return;
        }
        
        // Check if user is logged in
        const token = localStorage.getItem('auth-token');
        if (!token) {
            alert('Для оформления заказа необходимо войти в аккаунт');
            window.location.href = 'auth.html';
            return;
        }
        
        // Navigate to checkout page
        window.location.href = 'checkout.html';
    });
    
    // Updated products array with size information and inventory
    const products = [
        {
            id: 1,
            name: 'Nike Air Max 97',
            brand: 'Nike',
            price: 15990,
            color: 'Серебряный',
            popular: true,
            isNew: false,
            image: '<img src="Nike AIR max 97.png" alt="Nike Air Max 97">',
            sizes: [40, 41, 42, 43, 44, 45],
            inventory: {
                40: 5,
                41: 3,
                42: 2,
                43: 4,
                44: 1,
                45: 6
            }
        },
        {
            id: 2,
            name: 'Air Jordan 4 Retro',
            brand: 'Jordan',
            price: 21990,
            color: 'Черный/Белый',
            popular: true,
            isNew: true,
            image: '<img src="Nike Air Jordan 4.png" alt="Air Jordan 4 Retro">',
            sizes: [39, 40, 41, 42, 43, 44, 45],
            inventory: {
                39: 2,
                40: 4,
                41: 3,
                42: 5,
                43: 1,
                44: 6,
                45: 2
            }
        },
        {
            id: 3,
            name: 'Vans Old Skool',
            brand: 'Vans',
            price: 6990,
            color: 'Черный',
            popular: true,
            isNew: false,
            image: '<img src="Vans old school.png" alt="Vans Old Skool">',
            sizes: [36, 37, 38, 39, 40, 41, 42],
            inventory: {
                36: 1,
                37: 2,
                38: 3,
                39: 4,
                40: 5,
                41: 6,
                42: 2
            }
        },
        {
            id: 4,
            name: 'Adidas Ozweego',
            brand: 'Adidas',
            price: 12990,
            color: 'Красный/Серебряный',
            popular: false,
            isNew: true,
            image: '<img src="RAF SIMONS OZWEGO.png" alt="Adidas Ozweego">',
            sizes: [40, 41, 42, 43, 44, 45, 46],
            inventory: {
                40: 6,
                41: 5,
                42: 4,
                43: 3,
                44: 2,
                45: 1,
                46: 0
            }
        },
        {
            id: 5,
            name: 'Air Jordan 5 Retro',
            brand: 'Jordan',
            price: 19990,
            color: 'Оранжевый',
            popular: true,
            isNew: true,
            image: '<img src="Nike Air Jordan 5.png" alt="Air Jordan 5 Retro">',
            sizes: [41, 42, 43, 44, 45],
            inventory: {
                41: 3,
                42: 2,
                43: 1,
                44: 4,
                45: 5
            }
        },
        {
            id: 6,
            name: 'Balenciaga Track',
            brand: 'Balenciaga',
            price: 89990,
            color: 'Черный',
            popular: false,
            isNew: true,
            image: '<img src="Balenciaga track.png" alt="Balenciaga Track">',
            sizes: [39, 40, 41, 42, 43, 44],
            inventory: {
                39: 0,
                40: 1,
                41: 2,
                42: 3,
                43: 4,
                44: 5
            }
        },
        {
            id: 7,
            name: 'New Balance 2002R',
            brand: 'New Balance',
            price: 17990,
            color: 'Оранжевый/Желтый',
            popular: false,
            isNew: true,
            image: '<img src="Salehe Bembury X New Balance 2002R Peace Be.png" alt="New Balance 2002R">',
            sizes: [40, 41, 42, 43, 44, 45],
            inventory: {
                40: 5,
                41: 4,
                42: 3,
                43: 2,
                44: 1,
                45: 0
            }
        },
        {
            id: 8,
            name: 'Air Jordan 11 Retro',
            brand: 'Jordan',
            price: 22990,
            color: 'Черный/Белый',
            popular: true,
            isNew: false,
            image: '<img src="Jordan 11 retro.png" alt="Air Jordan 11 Retro">',
            sizes: [40, 41, 42, 43, 44, 45],
            inventory: {
                40: 2,
                41: 3,
                42: 4,
                43: 5,
                44: 1,
                45: 0
            }
        },
        {
            id: 9,
            name: 'Nike Dunk Low',
            brand: 'Nike',
            price: 10990,
            color: 'Черный/Белый',
            popular: true,
            isNew: false,
            image: '<img src="Nike Dunk low.png" alt="Nike Dunk Low">',
            sizes: [38, 39, 40, 41, 42, 43],
            inventory: {
                38: 1,
                39: 2,
                40: 3,
                41: 4,
                42: 5,
                43: 6
            }
        }
    ];

    // Create size selection modal
    const sizeModal = document.createElement('div');
    sizeModal.classList.add('size-modal');
    sizeModal.innerHTML = `
        <div class="size-modal-content">
            <div class="size-modal-header">
                <h3>Выберите размер</h3>
                <button class="close-size-modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="size-options" id="size-options">
                <!-- Size options will be added here -->
            </div>
            <div class="size-modal-footer">
                <button class="btn select-size-btn" id="select-size-btn" disabled>Добавить в корзину</button>
            </div>
        </div>
    `;
    document.body.appendChild(sizeModal);

    // Variables for size selection
    let currentProductId = null;
    let selectedSize = null;

    // Render products to catalog
    function renderProducts(productsArray) {
        const productsContainer = document.getElementById('products-container');
        productsContainer.innerHTML = '';
        
        productsArray.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <div class="product-image">
                    ${product.image}
                </div>
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-brand">${product.brand}</div>
                    <div class="product-color">${product.color}</div>
                    ${product.isNew ? '<span class="product-badge new">Новинка</span>' : ''}
                    <div class="product-price">${formatPrice(product.price)} ₽</div>
                    <div class="product-actions">
                        <button class="add-to-cart" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> В корзину
                        </button>
                    </div>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });
        
        // Add to cart functionality with size selection
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                openSizeModal(productId);
            });
        });
    }

    // Open size selection modal
    function openSizeModal(productId) {
        currentProductId = productId;
        selectedSize = null;
        
        const product = products.find(p => p.id === productId);
        const sizeOptions = document.getElementById('size-options');
        sizeOptions.innerHTML = '';
        
        // Create size buttons with inventory info
        product.sizes.forEach(size => {
            const quantity = product.inventory ? product.inventory[size] || 0 : 0;
            const sizeBtn = document.createElement('button');
            sizeBtn.classList.add('size-option');
            sizeBtn.setAttribute('data-size', size);
            
            // Disable button if out of stock
            if (quantity <= 0) {
                sizeBtn.disabled = true;
                sizeBtn.classList.add('out-of-stock');
                sizeBtn.innerHTML = `${size}<span class="stock-info">Нет в наличии</span>`;
            } else {
                sizeBtn.innerHTML = `${size}<span class="stock-info">В наличии: ${quantity}</span>`;
            }
            
            sizeBtn.addEventListener('click', function() {
                if (quantity <= 0) return;
                
                // Deselect all size buttons
                document.querySelectorAll('.size-option').forEach(btn => {
                    btn.classList.remove('selected');
                });
                
                // Select this button
                this.classList.add('selected');
                selectedSize = parseInt(this.getAttribute('data-size'));
                
                // Enable the add to cart button
                document.getElementById('select-size-btn').disabled = false;
            });
            
            sizeOptions.appendChild(sizeBtn);
        });
        
        // Show the modal
        sizeModal.classList.add('active');
        
        // Reset the add to cart button
        document.getElementById('select-size-btn').disabled = true;
    }

    // Close size modal
    document.querySelector('.close-size-modal').addEventListener('click', function() {
        sizeModal.classList.remove('active');
    });

    // Handle add to cart with size
    document.getElementById('select-size-btn').addEventListener('click', function() {
        if (selectedSize === null) return;
        
        const product = products.find(p => p.id === currentProductId);
        const availableQuantity = product.inventory ? product.inventory[selectedSize] || 0 : 0;
        
        // Check if product with this size is already in cart
        const existingItemIndex = cart.findIndex(item => item.id === currentProductId && item.size === selectedSize);
        
        if (existingItemIndex !== -1) {
            // Check if we have enough stock for one more
            if (cart[existingItemIndex].quantity + 1 > availableQuantity) {
                alert(`Извините, доступно только ${availableQuantity} шт. этого размера`);
                return;
            }
            cart[existingItemIndex].quantity++;
        } else {
            if (availableQuantity <= 0) {
                alert('Извините, данный размер закончился');
                return;
            }
            
            cart.push({
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                image: product.image,
                size: selectedSize,
                quantity: 1
            });
        }
        
        updateCart();
        
        // Close the modal
        sizeModal.classList.remove('active');
        
        // Show cart
        cartModal.classList.add('active');
    });

    // Filter and sort functionality
    const filterBrand = document.getElementById('filter-brand');
    const filterPrice = document.getElementById('filter-price');
    const filterSort = document.getElementById('filter-sort');
    
    async function applyFilters() {
        const filters = {
            brand: filterBrand ? filterBrand.value : 'all',
            price: filterPrice ? filterPrice.value : 'all',
            sort: filterSort ? filterSort.value : 'popular'
        };
        
        const productsData = await fetchProducts(filters);
        renderProducts(productsData);
    }

    // Add API integration for backend
    async function fetchProducts(filters = {}) {
        try {
            let url = '/api/products';
            const queryParams = new URLSearchParams();
            
            if (filters.brand && filters.brand !== 'all') {
                queryParams.append('brand', filters.brand);
            }
            
            if (filters.price && filters.price !== 'all') {
                queryParams.append('price', filters.price);
            }
            
            if (filters.sort) {
                queryParams.append('sort', filters.sort);
            }
            
            if (queryParams.toString()) {
                url += '?' + queryParams.toString();
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            
            const productsData = await response.json();
            return productsData;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    // Add functionality to handle different pages
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '') {
        // Homepage specific code if needed
    } else if (currentPage === 'catalog.html') {
        renderProducts(products);
        if (filterBrand && filterPrice && filterSort) {
            filterBrand.addEventListener('change', applyFilters);
            filterPrice.addEventListener('change', applyFilters);
            filterSort.addEventListener('change', applyFilters);
        }
    } else if (currentPage === 'contacts.html') {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;
                
                try {
                    const response = await fetch('/api/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name, email, message })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        alert(`Спасибо за сообщение, ${name}! Мы ответим вам на ${email} в ближайшее время.`);
                        contactForm.reset();
                    } else {
                        throw new Error(data.message || 'Ошибка при отправке сообщения');
                    }
                } catch (error) {
                    console.error('Error sending message:', error);
                    alert(`Ошибка: ${error.message}`);
                }
            });
        }
    } else if (currentPage === 'checkout.html') {
        // Checkout page functionality
        const checkoutItems = document.getElementById('checkout-items');
        const checkoutSubtotal = document.getElementById('checkout-subtotal');
        const checkoutShipping = document.getElementById('checkout-shipping');
        const checkoutTotal = document.getElementById('checkout-total');
        const checkoutForm = document.getElementById('checkout-form');
        const paymentCardRadio = document.getElementById('payment-card');
        const paymentCashRadio = document.getElementById('payment-cash');
        const cardDetails = document.getElementById('card-details');
        
        // Check if cart is empty, redirect to catalog if it is
        if (cart.length === 0) {
            window.location.href = 'catalog.html';
        }
        
        // Render checkout items
        function renderCheckoutItems() {
            if (!checkoutItems) return;
            
            checkoutItems.innerHTML = '';
            
            cart.forEach(item => {
                const checkoutItem = document.createElement('div');
                checkoutItem.classList.add('checkout-item');
                checkoutItem.innerHTML = `
                    <div class="checkout-item-image">
                        ${item.image}
                    </div>
                    <div class="checkout-item-info">
                        <div class="checkout-item-title">${item.name} (${item.quantity} шт.)</div>
                        <div class="checkout-item-size">Размер: ${item.size}</div>
                        <div class="checkout-item-price">${formatPrice(item.price * item.quantity)} ₽</div>
                    </div>
                `;
                checkoutItems.appendChild(checkoutItem);
            });
            
            // Calculate and display totals
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const shipping = subtotal > 0 ? (subtotal > 10000 ? 0 : 500) : 0;
            const total = subtotal + shipping;
            
            checkoutSubtotal.textContent = `${formatPrice(subtotal)} ₽`;
            checkoutShipping.textContent = shipping === 0 ? 'Бесплатно' : `${formatPrice(shipping)} ₽`;
            checkoutTotal.textContent = `${formatPrice(total)} ₽`;
        }
        
        // Toggle payment method fields
        if (paymentCardRadio && paymentCashRadio && cardDetails) {
            function togglePaymentFields() {
                if (paymentCardRadio.checked) {
                    cardDetails.style.display = 'block';
                } else {
                    cardDetails.style.display = 'none';
                }
            }
            
            paymentCardRadio.addEventListener('change', togglePaymentFields);
            paymentCashRadio.addEventListener('change', togglePaymentFields);
            
            // Initialize payment fields
            togglePaymentFields();
        }
        
        // Handle checkout form submission
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const fullname = document.getElementById('fullname').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const city = document.getElementById('city').value;
                const address = document.getElementById('address').value;
                const postcode = document.getElementById('postcode').value;
                const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
                
                // Validate form fields (simplified for brevity)
                if (paymentCardRadio.checked) {
                    const cardNumber = document.getElementById('card-number').value;
                    const cardExpiry = document.getElementById('card-expiry').value;
                    const cardCvv = document.getElementById('card-cvv').value;
                    
                    if (!cardNumber || !cardExpiry || !cardCvv) {
                        alert('Пожалуйста, заполните данные карты');
                        return;
                    }
                }
                
                // Prepare order data
                const orderItems = cart.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size
                }));
                
                const orderTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                const shipping = orderTotal > 10000 ? 0 : 500;
                
                const orderData = {
                    items: orderItems,
                    totalPrice: orderTotal + shipping,
                    shippingAddress: {
                        city,
                        address,
                        postcode
                    },
                    paymentMethod,
                    contact: {
                        fullname,
                        email,
                        phone
                    }
                };
                
                // Show loading state
                const submitBtn = document.getElementById('checkout-submit-btn');
                const originalBtnText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Обработка...';
                
                // Submit order to backend
                const result = await submitOrder(orderData);
                
                if (result.success) {
                    // Generate receipt and show download option
                    generateReceipt(orderData, result.orderId);
                    
                    // Show success message
                    alert(`Спасибо за заказ, ${fullname}! Ваш заказ успешно оформлен. Номер заказа: ${result.orderId}`);
                    
                    // Clear cart and redirect to home page
                    cart = [];
                    updateCart();
                    window.location.href = 'index.html';
                } else {
                    // Show error message
                    alert(`Ошибка при оформлении заказа: ${result.error}`);
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            });
        }
        
        // Render checkout items on page load
        renderCheckoutItems();
    }
    
    async function submitOrder(orderData) {
        try {
            // Check if user is logged in
            const token = localStorage.getItem('auth-token');
            if (!token) {
                alert('Пожалуйста, войдите в систему для оформления заказа');
                // Redirect to login page or show login modal
                return false;
            }
            
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(orderData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при оформлении заказа');
            }
            
            return { success: true, orderId: data.orderId };
        } catch (error) {
            console.error('Order submission error:', error);
            return { success: false, error: error.message };
        }
    }

    updateCart();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Account for header height
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    const spans = mobileMenuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    });

    // AI Chat Support
    const chatButton = document.createElement('div');
    chatButton.classList.add('chat-support-button');
    chatButton.innerHTML = '<i class="fas fa-comment-dots"></i>';
    document.body.appendChild(chatButton);
    
    const chatContainer = document.createElement('div');
    chatContainer.classList.add('chat-container');
    chatContainer.innerHTML = `
        <div class="chat-header">
            <h3>Поддержка HASL</h3>
            <button class="chat-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="chat-messages">
            <div class="message bot">
                <div class="message-content">
                    Привет! Меня зовут HASL-бот. Я помогу вам с выбором кроссовок и отвечу на вопросы о нашем магазине. Чем могу помочь?
                </div>
            </div>
        </div>
        <div class="chat-input-container">
            <input type="text" class="chat-input" placeholder="Введите сообщение...">
            <button class="chat-send"><i class="fas fa-paper-plane"></i></button>
        </div>
    `;
    document.body.appendChild(chatContainer);
    
    const chatMessages = chatContainer.querySelector('.chat-messages');
    const chatInput = chatContainer.querySelector('.chat-input');
    const chatSend = chatContainer.querySelector('.chat-send');
    const chatClose = chatContainer.querySelector('.chat-close');
    
    // Toggle chat window
    chatButton.addEventListener('click', function() {
        chatContainer.classList.add('active');
    });
    
    chatClose.addEventListener('click', function() {
        chatContainer.classList.remove('active');
    });
    
    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate AI response after delay
        setTimeout(() => {
            removeTypingIndicator();
            const response = generateAIResponse(message);
            addMessage(response, 'bot');
        }, 1500);
    }
    
    // Send on enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Send on button click
    chatSend.addEventListener('click', sendMessage);
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator');
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        typingDiv.id = 'typing-indicator';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Simple AI response generator based on keywords
    function generateAIResponse(message) {
        message = message.toLowerCase();
        
        if (message.includes('привет') || message.includes('здравствуй')) {
            return 'Привет! Чем я могу вам помочь сегодня?';
        } else if (message.includes('доставк')) {
            return 'Мы осуществляем доставку по всей России. Стандартная доставка занимает 3-5 рабочих дней. В Москве возможна доставка в день заказа.';
        } else if (message.includes('возврат') || message.includes('обмен')) {
            return 'Вы можете вернуть или обменять товар в течение 14 дней с момента получения, если он не был в использовании и сохранены все бирки и упаковка.';
        } else if (message.includes('nike') || message.includes('найк')) {
            return 'У нас большой выбор кроссовок Nike, включая популярные модели Air Max и Dunk. Вы можете посмотреть все модели в нашем каталоге.';
        } else if (message.includes('adidas') || message.includes('адидас')) {
            return 'В нашем магазине представлены кроссовки Adidas, включая Ozweego и другие популярные модели. Все модели доступны в каталоге.';
        } else if (message.includes('jordan') || message.includes('джордан')) {
            return 'Мы предлагаем широкий выбор кроссовок Jordan, включая Air Jordan 4, Air Jordan 5 и Air Jordan 11. Вы можете найти их в нашем каталоге.';
        } else if (message.includes('размер') || message.includes('размеры')) {
            return 'Мы предлагаем кроссовки в размерах от 36 до 46. Размерная сетка может отличаться в зависимости от бренда. Если у вас есть вопросы о конкретной модели, укажите её название.';
        } else if (message.includes('цена') || message.includes('стоимость') || message.includes('сколько стоит')) {
            return 'Цены на кроссовки варьируются в зависимости от модели и бренда. В нашем каталоге вы можете найти кроссовки от 6 990 ₽ до 89 990 ₽. Если вас интересует конкретная модель, пожалуйста, уточните.';
        } else if (message.includes('оплат')) {
            return 'Мы принимаем оплату наличными при получении, банковскими картами, а также через электронные платежные системы. Все операции безопасны и защищены.';
        } else if (message.includes('скидк') || message.includes('акци') || message.includes('распродаж')) {
            return 'У нас регулярно проводятся акции и распродажи. Подпишитесь на нашу рассылку или следите за нашими социальными сетями, чтобы узнавать о скидках первыми.';
        } else if (message.includes('контакт') || message.includes('телефон') || message.includes('почта')) {
            return 'Вы можете связаться с нами по телефону +7 (999) 123-45-67 или по электронной почте info@hasl-shoes.ru. Наш адрес: Москва, ул. Примерная, д. 123.';
        } else if (message.includes('спасибо') || message.includes('благодар')) {
            return 'Всегда рады помочь! Если у вас возникнут еще вопросы, не стесняйтесь обращаться.';
        } else {
            return 'Извините, я не совсем понял ваш вопрос. Могли бы вы перефразировать? Я могу рассказать о доставке, возврате, наличии размеров, ценах или конкретных моделях кроссовок.';
        }
    }

    // Authentication related code
    async function setupAuthUI() {
        const token = localStorage.getItem('auth-token');
        const userName = localStorage.getItem('user-name');
        
        // Add auth elements to the header
        const headerActions = document.querySelector('.header-actions');
        
        // Check if auth container already exists
        let authContainer = document.querySelector('.auth-container');
        if (!authContainer) {
            authContainer = document.createElement('div');
            authContainer.classList.add('auth-container');
            headerActions.insertBefore(authContainer, headerActions.firstChild);
        } else {
            authContainer.innerHTML = '';
        }
        
        if (token && userName) {
            // User is logged in
            authContainer.innerHTML = `
                <div class="user-menu">
                    <span class="user-name">${userName} <i class="fas fa-chevron-down"></i></span>
                    <div class="user-dropdown">
                        <a href="account.html">Мой аккаунт</a>
                        <a href="#" id="logout-btn">Выйти</a>
                    </div>
                </div>
            `;
            
            // Setup logout
            document.getElementById('logout-btn').addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('auth-token');
                localStorage.removeItem('user-name');
                window.location.reload();
            });
        } else {
            // User is not logged in
            authContainer.innerHTML = `
                <a href="auth.html" class="auth-btn">Войти</a>
            `;
        }
    }

    // Call setupAuthUI on page load
    setupAuthUI();

    // Auth page specific code
    if (window.location.pathname.includes('auth.html')) {
        // Tab functionality
        const tabs = document.querySelectorAll('.auth-tab');
        const forms = document.querySelectorAll('.auth-form');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show target form
                forms.forEach(form => {
                    if (form.id === `${targetTab}-form`) {
                        form.classList.add('active');
                    } else {
                        form.classList.remove('active');
                    }
                });
            });
        });
        
        // Login form submission
        const loginForm = document.getElementById('login-form');
        const loginMessage = document.getElementById('login-message');
        
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            try {
                loginMessage.classList.remove('error', 'success');
                loginMessage.textContent = 'Выполняется вход...';
                
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    loginMessage.classList.add('success');
                    loginMessage.textContent = 'Вход выполнен успешно! Перенаправление...';
                    
                    localStorage.setItem('auth-token', data.token);
                    localStorage.setItem('user-name', data.user.name);
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    loginMessage.classList.add('error');
                    loginMessage.textContent = data.message || 'Ошибка входа';
                }
            } catch (error) {
                console.error('Login error:', error);
                loginMessage.classList.add('error');
                loginMessage.textContent = 'Ошибка сервера. Пожалуйста, попробуйте позже.';
            }
        });
        
        // Register form submission
        const registerForm = document.getElementById('register-form');
        const registerMessage = document.getElementById('register-message');
        
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const passwordConfirm = document.getElementById('register-password-confirm').value;
            
            if (password !== passwordConfirm) {
                registerMessage.classList.add('error');
                registerMessage.textContent = 'Пароли не совпадают';
                return;
            }
            
            try {
                registerMessage.classList.remove('error', 'success');
                registerMessage.textContent = 'Регистрация...';
                
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    registerMessage.classList.add('success');
                    registerMessage.textContent = 'Регистрация успешна! Теперь вы можете войти.';
                    
                    // Clear form
                    registerForm.reset();
                    
                    // Switch to login tab
                    document.querySelector('.auth-tab[data-tab="login"]').click();
                } else {
                    registerMessage.classList.add('error');
                    registerMessage.textContent = data.message || 'Ошибка регистрации';
                }
            } catch (error) {
                console.error('Registration error:', error);
                registerMessage.classList.add('error');
                registerMessage.textContent = 'Ошибка сервера. Пожалуйста, попробуйте позже.';
            }
        });
    }

    // Account page specific code
    if (window.location.pathname.includes('account.html')) {
        // Check if user is logged in
        const token = localStorage.getItem('auth-token');
        if (!token) {
            window.location.href = 'auth.html';
        }
        
        // Tab functionality
        const tabs = document.querySelectorAll('.account-tab');
        const contents = document.querySelectorAll('.account-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show target content
                contents.forEach(content => {
                    if (content.id === `${targetTab}-content`) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
        
        // Load orders
        async function loadOrders() {
            try {
                const orderList = document.getElementById('order-list');
                
                const response = await fetch('/api/orders', {
                    headers: {
                        'x-auth-token': localStorage.getItem('auth-token')
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                
                const orders = await response.json();
                
                orderList.innerHTML = '';
                
                if (orders.length === 0) {
                    orderList.innerHTML = '<p>У вас пока нет заказов</p>';
                    return;
                }
                
                orders.forEach(order => {
                    const orderDate = new Date(order.created_at).toLocaleDateString('ru-RU');
                    const orderTime = new Date(order.created_at).toLocaleTimeString('ru-RU');
                    
                    const orderElement = document.createElement('div');
                    orderElement.classList.add('order-item');
                    
                    let itemsHtml = '';
                    order.items.forEach(item => {
                        itemsHtml += `
                            <div class="order-product">
                                <div class="order-product-info">
                                    <div>${item.name}</div>
                                    <div>Размер: ${item.size}</div>
                                    <div>Количество: ${item.quantity}</div>
                                    <div>${formatPrice(item.price)} ₽</div>
                                </div>
                            </div>
                        `;
                    });
                    
                    orderElement.innerHTML = `
                        <div class="order-header">
                            <div>
                                <strong>Заказ №${order.id}</strong>
                                <div>${orderDate} в ${orderTime}</div>
                            </div>
                            <div>
                                <span class="order-status">${order.status}</span>
                            </div>
                        </div>
                        <div class="order-products">
                            ${itemsHtml}
                        </div>
                        <div class="order-footer">
                            <div>Способ оплаты: ${order.payment_method === 'card' ? 'Банковская карта' : 'Наличными при получении'}</div>
                            <div>Итого: ${formatPrice(order.total_price)} ₽</div>
                        </div>
                    `;
                    
                    orderList.appendChild(orderElement);
                });
            } catch (error) {
                console.error('Error loading orders:', error);
                document.getElementById('order-list').innerHTML = '<p>Ошибка при загрузке заказов</p>';
            }
        }
        
        // Load user info
        async function loadUserInfo() {
            try {
                const userInfo = document.getElementById('user-info');
                const profileForm = document.getElementById('profile-form');
                
                const response = await fetch('/api/user', {
                    headers: {
                        'x-auth-token': localStorage.getItem('auth-token')
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch user info');
                }
                
                const user = await response.json();
                
                userInfo.innerHTML = `
                    <div class="user-info-item">
                        <div class="user-info-label">Имя:</div>
                        <div>${user.name}</div>
                    </div>
                    <div class="user-info-item">
                        <div class="user-info-label">Email:</div>
                        <div>${user.email}</div>
                    </div>
                    <div class="user-info-item">
                        <div class="user-info-label">Адрес:</div>
                        <div>${user.address || 'Не указан'}</div>
                    </div>
                    <div class="user-info-item">
                        <div class="user-info-label">Телефон:</div>
                        <div>${user.phone || 'Не указан'}</div>
                    </div>
                    <div class="user-info-item">
                        <div class="user-info-label">Дата регистрации:</div>
                        <div>${new Date(user.created_at).toLocaleDateString('ru-RU')}</div>
                    </div>
                    <button class="btn" id="edit-profile-btn">Редактировать</button>
                `;
                
                // Fill form with user data
                document.getElementById('profile-name').value = user.name;
                document.getElementById('profile-address').value = user.address || '';
                document.getElementById('profile-phone').value = user.phone || '';
                
                // Show edit form on button click
                document.getElementById('edit-profile-btn').addEventListener('click', function() {
                    userInfo.style.display = 'none';
                    profileForm.style.display = 'block';
                });
                
                // Handle form submission
                profileForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    const name = document.getElementById('profile-name').value;
                    const address = document.getElementById('profile-address').value;
                    const phone = document.getElementById('profile-phone').value;
                    const profileMessage = document.getElementById('profile-message');
                    
                    try {
                        profileMessage.classList.remove('error', 'success');
                        profileMessage.textContent = 'Сохранение...';
                        
                        const response = await fetch('/api/user', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-auth-token': localStorage.getItem('auth-token')
                            },
                            body: JSON.stringify({ name, address, phone })
                        });
                        
                        const data = await response.json();
                        
                        if (response.ok) {
                            profileMessage.classList.add('success');
                            profileMessage.textContent = 'Профиль успешно обновлен';
                            
                            // Update stored name if changed
                            if (name !== localStorage.getItem('user-name')) {
                                localStorage.setItem('user-name', name);
                                setupAuthUI();
                            }
                            
                            // Reload user info
                            setTimeout(() => {
                                profileForm.style.display = 'none';
                                userInfo.style.display = 'block';
                                loadUserInfo();
                            }, 1000);
                        } else {
                            profileMessage.classList.add('error');
                            profileMessage.textContent = data.message || 'Ошибка обновления профиля';
                        }
                    } catch (error) {
                        console.error('Profile update error:', error);
                        profileMessage.classList.add('error');
                        profileMessage.textContent = 'Ошибка сервера. Пожалуйста, попробуйте позже.';
                    }
                });
            } catch (error) {
                console.error('Error loading user info:', error);
                document.getElementById('user-info').innerHTML = '<p>Ошибка при загрузке данных пользователя</p>';
            }
        }
        
        // Load data
        loadOrders();
        loadUserInfo();
    }

    // Generate receipt function
    async function generateReceipt(orderData, orderId) {
        try {
            // Create download container
            const downloadContainer = document.createElement('div');
            downloadContainer.classList.add('receipt-download-container');
            downloadContainer.innerHTML = `
                <div class="receipt-download">
                    <p>Ваш чек сформирован и отправлен на почту ${orderData.contact.email}</p>
                    <a href="/api/receipts/${orderId}" target="_blank" class="btn receipt-download-btn">
                        <i class="fas fa-download"></i> Посмотреть чек
                    </a>
                    <a href="/api/receipts/${orderId}" download="receipt-order-${orderId}.html" class="btn receipt-download-btn">
                        <i class="fas fa-download"></i> Скачать чек
                    </a>
                </div>
            `;
            
            document.querySelector('.checkout-content').appendChild(downloadContainer);
            
            // Send receipt by email
            await sendReceiptByEmail(orderData.contact.email, orderId);
        } catch (error) {
            console.error('Error generating receipt:', error);
        }
    }

    // Send receipt by email
    async function sendReceiptByEmail(email, orderId) {
        try {
            const response = await fetch('/api/send-receipt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify({
                    email: email,
                    orderId: orderId
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                console.error('Error sending receipt:', data.message);
            }
        } catch (error) {
            console.error('Failed to send receipt email:', error);
        }
    }
});