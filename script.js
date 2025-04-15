// Datos de muestra (para que puedas probar el sistema de inmediato)
let products = [
    { id: 1, code: "F001", name: "Funda iPhone 13", category: "Fundas", price: 15.99, stock: 25 },
    { id: 2, code: "H002", name: "Hidrogel Samsung S21", category: "Hidrogel", price: 12.50, stock: 15 },
    { id: 3, code: "V003", name: "Vidrio Templado iPhone 12", category: "Vidrio Templado", price: 8.99, stock: 30 },
    { id: 4, code: "P004", name: "Parlante Bluetooth JBL", category: "Parlantes", price: 45.99, stock: 8 },
    { id: 5, code: "T005", name: "Teclado USB RGB", category: "Teclados", price: 35.50, stock: 5 }
];

let sales = [];
let cart = [];
let nextProductId = products.length + 1;
let nextSaleId = 1;

// Funciones de inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadInventory();
    loadSalesHistory();
    updateDashboard();
    
    // Configurar eventos para formularios
    document.getElementById('product-form').addEventListener('submit', saveProduct);
    
    // Configurar evento para escaneo manual
    document.getElementById('scan-button').addEventListener('click', simulateScanner);
    
    // Cargar datos de localStorage si existen
    loadDataFromStorage();
});

// Función para simular un escáner (para demostración)
function simulateScanner() {
    const status = document.getElementById('scanner-status');
    status.textContent = "Escaneando... (simulación)";
    
    setTimeout(() => {
        // Selecciona un producto aleatorio para simular el escaneo
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        document.getElementById('manual-code').value = randomProduct.code;
        status.textContent = `Producto escaneado: ${randomProduct.name}`;
    }, 1500);
}

// Manejo de pestañas
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Quitar clase activa de todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            // Agregar clase activa a la pestaña seleccionada
            tab.classList.add('active');
            
            // Ocultar todos los contenidos
            document.querySelectorAll('.content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostrar el contenido correspondiente
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Funciones de Inventario
function loadInventory() {
    const inventoryTable = document.getElementById('inventory-table');
    inventoryTable.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        
        // Colorear fila según el stock
        if (product.stock <= 5) {
            row.style.backgroundColor = "#ffebee"; // Rojo claro para stock bajo
        }
        
        row.innerHTML = `
            <td>${product.code}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td class="action-buttons">
                <button onclick="editProduct(${product.id})">Editar</button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">Eliminar</button>
            </td>
        `;
        
        inventoryTable.appendChild(row);
    });
}

function searchInventory() {
    const searchTerm = document.getElementById('inventory-search').value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        loadInventory();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.code.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    const inventoryTable = document.getElementById('inventory-table');
    inventoryTable.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        
        if (product.stock <= 5) {
            row.style.backgroundColor = "#ffebee";
        }
        
        row.innerHTML = `
            <td>${product.code}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td class="action-buttons">
                <button onclick="editProduct(${product.id})">Editar</button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">Eliminar</button>
            </td>
        `;
        
        inventoryTable.appendChild(row);
    });
}

function openAddProductModal() {
    document.getElementById('modal-title').textContent = 'Agregar Producto';
    document.getElementById('edit-id').value = '';
    document.getElementById('product-form').reset();
    document.getElementById('product-modal').style.display = 'block';
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    
    if (product) {
        document.getElementById('modal-title').textContent = 'Editar Producto';
        document.getElementById('edit-id').value = product.id;
        document.getElementById('product-code').value = product.code;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        
        document.getElementById('product-modal').style.display = 'block';
    }
}

function saveProduct(event) {
    event.preventDefault();
    
    const editId = document.getElementById('edit-id').value;
    const code = document.getElementById('product-code').value;
    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    
    if (editId) {
        // Actualizar producto existente
        const productIndex = products.findIndex(p => p.id === parseInt(editId));
        if (productIndex !== -1) {
            products[productIndex] = {
                id: parseInt(editId),
                code,
                name,
                category,
                price,
                stock
            };
            
            showNotification('Producto actualizado correctamente');
        }
    } else {
        // Crear nuevo producto
        const newProduct = {
            id: nextProductId++,
            code,
            name,
            category,
            price,
            stock
        };
        
        products.push(newProduct);
        showNotification('Producto agregado correctamente');
    }
    
    // Actualizar la interfaz
    closeProductModal();
    loadInventory();
    updateDashboard();
    saveDataToStorage();
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        products = products.filter(p => p.id !== id);
        loadInventory();
        updateDashboard();
        saveDataToStorage();
        showNotification('Producto eliminado correctamente');
    }
}

// Funciones de Ventas
function addProductToCart() {
    const codeInput = document.getElementById('manual-code');
    const code = codeInput.value.trim();
    
    if (code === '') {
        showNotification('Ingrese un código de producto', 'error');
        return;
    }
    
    const product = products.find(p => p.code.toLowerCase() === code.toLowerCase());
    
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    if (product.stock <= 0) {
        showNotification('Producto sin stock', 'error');
        return;
    }
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
        // Incrementar cantidad si ya existe
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showNotification('No hay suficiente stock', 'error');
            return;
        }
    } else {
        // Agregar nuevo item al carrito
        cart.push({
            productId: product.id,
            code: product.code,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    // Actualizar la vista del carrito
    updateCartView();
    codeInput.value = '';
    codeInput.focus();
    showNotification('Producto agregado al carrito');
}

function updateCartView() {
    const cartTable = document.getElementById('cart-items');
    const saleTotal = document.getElementById('sale-total');
    
    cartTable.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        row.innerHTML = `
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <button onclick="decreaseQuantity(${index})">-</button>
                ${item.quantity}
                <button onclick="increaseQuantity(${index})">+</button>
            </td>
            <td>$${subtotal.toFixed(2)}</td>
            <td>
                <button class="delete-btn" onclick="removeFromCart(${index})">Eliminar</button>
            </td>
        `;
        
        cartTable.appendChild(row);
    });
    
    saleTotal.textContent = `$${total.toFixed(2)}`;
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        updateCartView();
    }
}

function increaseQuantity(index) {
    const product = products.find(p => p.id === cart[index].productId);
    
    if (cart[index].quantity < product.stock) {
        cart[index].quantity++;
        updateCartView();
    } else {
        showNotification('No hay suficiente stock', 'error');
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartView();
}

function completeSale() {
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'error');
        return;
    }
    
    // Calcular total
    let total = 0;
    const saleItems = cart.map(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        // Actualizar stock
        const productIndex = products.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
            products[productIndex].stock -= item.quantity;
        }
        
        return {
            productId: item.productId,
            code: item.code,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: subtotal
        };
    });
    
    // Crear registro de venta
    const sale = {
        id: nextSaleId++,
        date: new Date(),
        items: saleItems,
        total: total
    };
    
    sales.push(sale);
    
    // Limpiar carrito
    cart = [];
    updateCartView();
    
    // Actualizar vistas
    loadInventory();
    loadSalesHistory();
    updateDashboard();
    saveDataToStorage();
    
    showNotification('Venta completada correctamente');
}

function loadSalesHistory() {
    const salesTable = document.getElementById('sales-history');
    salesTable.innerHTML = '';
    
    // Ordenar ventas de más reciente a más antigua
    const sortedSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedSales.forEach(sale => {
        const row = document.createElement('tr');
        const date = new Date(sale.date);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>#${sale.id}</td>
            <td>${sale.items.length} productos</td>
            <td>$${sale.total.toFixed(2)}</td>
            <td>
                <button onclick="viewSaleDetails(${sale.id})">Ver Detalles</button>
            </td>
        `;
        
        salesTable.appendChild(row);
    });
    
    // Actualizar también las ventas recientes en el dashboard
    const recentSales = document.getElementById('recent-sales');
    recentSales.innerHTML = '';
    
    sortedSales.slice(0, 5).forEach(sale => {
        const date = new Date(sale.date);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>#${sale.id}</td>
            <td>${sale.items.length} productos</td>
            <td>$${sale.total.toFixed(2)}</td>
        `;
        
        recentSales.appendChild(row);
    });
}

function viewSaleDetails(saleId) {
    const sale = sales.find(s => s.id === saleId);
    
    if (sale) {
        document.getElementById('sale-id').textContent = sale.id;
        
        const date = new Date(sale.date);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        document.getElementById('sale-date').textContent = formattedDate;
        
        const saleItemsTable = document.getElementById('sale-items');
        saleItemsTable.innerHTML = '';
        
        sale.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${item.subtotal.toFixed(2)}</td>
            `;
            
            saleItemsTable.appendChild(row);
        });
        
        document.getElementById('sale-total-detail').textContent = sale.total.toFixed(2);
        document.getElementById('sale-details-modal').style.display = 'block';
    }
}

function closeSaleDetailsModal() {
    document.getElementById('sale-details-modal').style.display = 'none';
}

// Funciones de Búsqueda
function searchProducts() {
    const searchTerm = document.getElementById('search-term').value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        document.getElementById('search-results').innerHTML = '';
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.code.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    const resultsTable = document.getElementById('search-results');
    resultsTable.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5">No se encontraron resultados</td>';
        resultsTable.appendChild(row);
        return;
    }
    
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        
        // Colorear fila según el stock
        if (product.stock <= 5) {
            row.style.backgroundColor = "#ffebee";
        }
        
        row.innerHTML = `
            <td>${product.code}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
        `;
        
        resultsTable.appendChild(row);
    });
}

// Funciones del Dashboard
function updateDashboard() {
    // Total de productos
    document.getElementById('total-products').textContent = products.length;
    
    // Productos de bajo stock
    const lowStockProducts = products.filter(p => p.stock <= 5).length;
    document.getElementById('low-stock').textContent = lowStockProducts;
    
    // Ventas de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate.getTime() === today.getTime();
    });
    
    const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    document.getElementById('sales-today').textContent = `$${todayTotal.toFixed(2)}`;
    
    // Ventas de la semana
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weekSales = sales.filter(sale => new Date(sale.date) >= oneWeekAgo);
    const weekTotal = weekSales.reduce((sum, sale) => sum + sale.total, 0);
    document.getElementById('sales-week').textContent = `$${weekTotal.toFixed(2)}`;
}

// Funciones de notificación
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#F44336';
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Funciones de almacenamiento local
function saveDataToStorage() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('nextProductId', nextProductId);
    localStorage.setItem('nextSaleId', nextSaleId);
}

function loadDataFromStorage() {
    const storedProducts = localStorage.getItem('products');
    const storedSales = localStorage.getItem('sales');
    const storedNextProductId = localStorage.getItem('nextProductId');
    const storedNextSaleId = localStorage.getItem('nextSaleId');
    
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    }
    
    if (storedSales) {
        sales = JSON.parse(storedSales);
    }
    
    if (storedNextProductId) {
        nextProductId = parseInt(storedNextProductId);
    }
    
    if (storedNextSaleId) {
        nextSaleId = parseInt(storedNextSaleId);
    }
    
    // Actualizar la interfaz
    loadInventory();
    loadSalesHistory();
    updateDashboard();
}