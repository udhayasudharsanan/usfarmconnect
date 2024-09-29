const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const adminRoutes = require('./routes/admin');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'https://your-frontend-url.com',  // Replace with your Vercel or frontend URL
}));


// Routes
// Pass io to the request object in all routes
app.use((req, res, next) => {
    req.io = io;  // Attach Socket.io to the request object
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.get('/', (req, res) => {
    res.send('Backend is running. API is available.');
});

// MongoDB Connection
mongoose.connect('mongodb+srv://SivaUdhi:UtSCnZrWPFjcOyiR@cluster0.psxhm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Real-time connection with Socket.io
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Listen on a dynamic port from the environment or default to 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { io };  // Export io for use in routes

