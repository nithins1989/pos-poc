// Configuration
const API_BASE_URL = 'https://X/test';
const ORDERS_ENDPOINT = `${API_BASE_URL}/orders`;

// State
let orders = [];
let selectedOrderId = null;

// DOM Elements
const orderListEl = document.getElementById('order-list');
const orderDetailsEl = document.getElementById('order-details');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const useMock = true; // Set to false to use real API
    
    if (useMock) {
        useMockData();
    } else {
        fetchOrders();
        setInterval(fetchOrders, 30000);
    }
});

// Fetch Orders from API
async function fetchOrders() {
    try {
        if (orders.length === 0) {
            orderListEl.innerHTML = '<p class="loading">Loading orders...</p>';
        }
        
        const response = await fetch(ORDERS_ENDPOINT);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        orders = parseOrdersData(data);
        renderOrderList();
        
    } catch (error) {
        console.error('Error fetching orders:', error);
        orderListEl.innerHTML = `<p class="error">Failed to load orders.<br><small>${error.message}</small></p>`;
    }
}

// Parse the order structure
function parseOrdersData(data) {
    const parsedOrders = [];
    
    // Handle the structure: {"orders": [...]}
    const ordersList = data.orders || data;
    
    ordersList.forEach(order => {
        const orderId = order.id;
        const customerName = order.customer_name;
        const timestamp = order.timestamp;
        const items = order.items || [];
        
        // Calculate total for the order
        const orderTotal = items.reduce((sum, item) => {
            return sum + (item.price * item.qty);
        }, 0);
        
        // Create an entry for the order with all items
        parsedOrders.push({
            id: orderId,
            customerName: customerName,
            timestamp: timestamp,
            items: items,
            total: orderTotal,
            itemCount: items.length
        });
    });
    
    return parsedOrders;
}

// Render Order List
function renderOrderList() {
    if (orders.length === 0) {
        orderListEl.innerHTML = '<p class="placeholder">No orders found.</p>';
        return;
    }
    
    orderListEl.innerHTML = '';
    
    orders.forEach(order => {
        const orderItem = createOrderItem(order);
        orderListEl.appendChild(orderItem);
    });
}

// Create Order Item Element
function createOrderItem(order) {
    const div = document.createElement('div');
    div.className = 'order-item';
    if (selectedOrderId === order.id) {
        div.classList.add('selected');
    }
    
    div.innerHTML = `
        <div class="order-item-info">
            <div class="order-item-id">${order.id}</div>
            <div class="order-item-name">${order.customerName}</div>
            <div class="order-item-meta">${order.itemCount} item(s) • $${order.total.toFixed(2)}</div>
        </div>
    `;
    
    div.addEventListener('click', () => selectOrder(order.id));
    
    return div;
}

// Select Order
function selectOrder(orderId) {
    selectedOrderId = orderId;
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        renderOrderDetails(order);
        updateSelectedOrderUI();
    }
}

// Update Selected Order UI
function updateSelectedOrderUI() {
    const orderItems = document.querySelectorAll('.order-item');
    orderItems.forEach(item => {
        const orderIdText = item.querySelector('.order-item-id').textContent;
        
        if (orderIdText === selectedOrderId) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

// Render Order Details
function renderOrderDetails(order) {
    let itemsHtml = '';
    
    order.items.forEach(item => {
        const itemTotal = item.price * item.qty;
        itemsHtml += `
            <div class="item-row">
                <img src="${item.thumbnail}" alt="${item.product_name}" class="item-thumbnail" 
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect fill=%22%23ddd%22 width=%2280%22 height=%2280%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2212%22%3ENo Image%3C/text%3E%3C/svg%3E'">
                <div class="item-info">
                    <div class="item-id">${item.id}</div>
                    <div class="item-name">${item.product_name}</div>
                    <div class="item-sku">SKU: ${item.sku}</div>
                </div>
                <div class="item-details">
                    <span>$${item.price.toFixed(2)} × ${item.qty}</span>
                    <span class="item-total">$${itemTotal.toFixed(2)}</span>
                </div>
            </div>
        `;
    });
    
    // Format timestamp
    const orderDate = new Date(order.timestamp);
    const formattedDate = orderDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    orderDetailsEl.innerHTML = `
        <div class="order-details-content">
            <div class="order-header">
                <h3>${order.id}</h3>
                <p class="customer-name">${order.customerName}</p>
                <p class="order-timestamp">${formattedDate}</p>
            </div>
            
            <div class="items-section">
                <h4>Items (${order.itemCount})</h4>
                ${itemsHtml}
            </div>
            
            <div class="order-total-section">
                <div class="detail-row total-row">
                    <span class="detail-label">Total Amount:</span>
                    <span class="detail-value total">$${order.total.toFixed(2)}</span>
                </div>
            </div>
            
            <button class="add-to-order-btn" onclick="addToOrder()">Add to Order</button>
        </div>
    `;
}

// Add to Order function
function addToOrder() {
    if (!selectedOrderId) {
        alert('Please select an order first');
        return;
    }
    
    const order = orders.find(o => o.id === selectedOrderId);
    
    // Here you can add your logic to POST to an endpoint
    console.log('Adding to order:', order);
    alert(`Order ${selectedOrderId} for ${order.customerName} added successfully!`);
    
    // Example POST request (uncomment and modify as needed):
    /*
    fetch('https://X/test/add-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => {
        alert('Order added successfully!');
        console.log('Success:', data);
    })
    .catch((error) => {
        alert('Error adding order');
        console.error('Error:', error);
    });
    */
}

// Mock data for testing
function useMockData() {
    const mockApiResponse = {
        "orders": [
            {
                "id": "ORD-1001",
                "customer_name": "Alice Johnson",
                "timestamp": "2025-01-15T10:24:30Z",
                "items": [
                    {
                        "id": "ITEM-001",
                        "sku": "TSH-CTN-001",
                        "product_name": "Cotton T-Shirt",
                        "price": 12.99,
                        "qty": 2,
                        "thumbnail": "https://via.placeholder.com/80/3498DB/FFFFFF?text=T-Shirt"
                    },
                    {
                        "id": "ITEM-002",
                        "sku": "JNS-DNM-034",
                        "product_name": "Denim Jeans",
                        "price": 39.99,
                        "qty": 1,
                        "thumbnail": "https://via.placeholder.com/80/2C3E50/FFFFFF?text=Jeans"
                    }
                ]
            },
            {
                "id": "ORD-1002",
                "customer_name": "Brian Smith",
                "timestamp": "2025-01-15T11:05:10Z",
                "items": [
                    {
                        "id": "ITEM-010",
                        "sku": "HDY-FLC-120",
                        "product_name": "Hoodie",
                        "price": 29.99,
                        "qty": 1,
                        "thumbnail": "https://via.placeholder.com/80/E74C3C/FFFFFF?text=Hoodie"
                    },
                    {
                        "id": "ITEM-011",
                        "sku": "CAP-CLT-021",
                        "product_name": "Baseball Cap",
                        "price": 14.50,
                        "qty": 1,
                        "thumbnail": "https://via.placeholder.com/80/F39C12/FFFFFF?text=Cap"
                    },
                    {
                        "id": "ITEM-012",
                        "sku": "SOX-ATH-003",
                        "product_name": "Athletic Socks (3-Pack)",
                        "price": 9.99,
                        "qty": 2,
                        "thumbnail": "https://via.placeholder.com/80/27AE60/FFFFFF?text=Socks"
                    }
                ]
            },
            {
                "id": "ORD-1003",
                "customer_name": "Carla Reyes",
                "timestamp": "2025-01-15T12:40:55Z",
                "items": [
                    {
                        "id": "ITEM-020",
                        "sku": "JKT-LGT-078",
                        "product_name": "Lightweight Jacket",
                        "price": 49.99,
                        "qty": 1,
                        "thumbnail": "https://via.placeholder.com/80/9B59B6/FFFFFF?text=Jacket"
                    }
                ]
            }
        ]
    };
    
    orders = parseOrdersData(mockApiResponse);
    renderOrderList();
}
