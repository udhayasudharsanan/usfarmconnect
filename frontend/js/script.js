// Initialize Socket.io connection
const socket = io('https://usfarmconnect.onrender.com');

// Login Form Submission Handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevents page refresh

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Email:', email);  // Log email
    console.log('Password:', password);  // Log password
    
    try {
        // Send login credentials to the backend API
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

            // Store the JWT token for future use (e.g., making authenticated requests)
            localStorage.setItem('token', token);

            // Redirect the user based on their role
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
            // Handle login failure
            alert('Login failed: ' + data.msg);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred while logging in. Please try again.');
    }
});
// Signup form submission
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevents the page from refreshing

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch('https://usfarmconnect.onrender.com/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Signup successful!');
        } else {
            alert('Signup failed: ' + data.msg);
        }
    } catch (error) {
        console.error('Error during signup:', error);
    }
});

// Fetch and display products (Consumer and Admin dashboards)
document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('productList');

    if (productList) {
        try {
            // Fetch the list of products from the backend API
            const response = await fetch('https://usfarmconnect.onrender.com/api/products');
            const products = await response.json();

            // Display the fetched products on the page
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

            // Listen for real-time new product updates via Socket.io
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

        } catch (error) {
            console.error('Error fetching products:', error);
            alert('An error occurred while fetching products. Please try again.');
        }
    }
});

