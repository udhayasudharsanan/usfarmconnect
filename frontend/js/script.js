// Signup Function
const socket = io('https://usfarmconnect.onrender.com');

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
