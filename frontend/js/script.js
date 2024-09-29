// Signup Function
const socket = io('https://usfarmconnect.onrender.com');

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevents page refresh

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://usfarmconnect.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Successfully logged in!');
            const { token, role } = data;

            // Store the JWT token for further authentication (optional)
            localStorage.setItem('token', token);

            // Redirect based on the user's role
            if (role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else if (role === 'farmer') {
                window.location.href = 'farmer-dashboard.html';
            } else if (role === 'consumer') {
                window.location.href = 'consumer-dashboard.html';
            } else {
                alert('Unknown role!');
            }
        } else {
            alert('Login failed: ' + data.msg);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred while logging in.');
    }
});


// Fetch and display products (Consumer and Admin)
document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('productList');
    
    if (productList) {
        const response = await fetch('https://usfarmconnect.onrender.com/api/products');
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

        // Listen for new products via Socket.io
        socket.on('newProduct', (newProduct) => {
            const productElement = document.createElement('div');
            productElement.classList.add('product-card');
            productElement.innerHTML = `
                <h3>${newProduct.name}</h3>
                <p>Quantity: ${newProduct.quantity}</p>
                <p>Price: $${newProduct.price}</p>
                <p>Farmer: ${newProduct.farmer}</p>
            `;
            productList.appendChild(productElement);
        });
    }
});
