// Signup Function
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value; // farmer/consumer/admin

    const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
    });

    const data = await response.json();

    if (response.ok) {
        alert('Signup successful! Please log in.');
        window.location.href = 'login.html';  // Redirect to login page after signup
    } else {
        alert('Signup failed: ' + data.msg);
    }
});
// Login Function
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem('token', data.token);  // Store JWT token
        alert('Login successful!');
        
        if (data.role === 'farmer') {
            window.location.href = 'farmer-dashboard.html';
        } else if (data.role === 'consumer') {
            window.location.href = 'consumer-dashboard.html';
        } else if (data.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        }
    } else {
        alert('Login failed: ' + data.msg);
    }
});
// Fetch and display products (for consumers)
document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('productList');
    
    if (productList) {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product-card');
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>Quantity: ${product.quantity}</p>
                <p>Price: $${product.price}</p>
                <p>Farmer: ${product.farmer.name}</p>
            `;
            productList.appendChild(productElement);
        });
    }
});
// Fetch and display products (for consumers)
document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('productList');
    
    if (productList) {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product-card');
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>Quantity: ${product.quantity}</p>
                <p>Price: $${product.price}</p>
                <p>Farmer: ${product.farmer.name}</p>
            `;
            productList.appendChild(productElement);
        });
    }
});
// Add product (for farmers)
document.getElementById('addProductForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('productName').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const token = localStorage.getItem('token');  // Get JWT token

    const response = await fetch('http://localhost:5000/api/products/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token  // Include token in request header
        },
        body: JSON.stringify({ name, quantity, price })
    });

    if (response.ok) {
        alert('Product added successfully!');
        window.location.reload();
    } else {
        const data = await response.json();
        alert('Failed to add product: ' + data.msg);
    }
});
