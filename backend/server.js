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
        origin: 'https://usfarmconnect.vercel.app',  // Allow the same frontend origin
        methods: ["GET", "POST"],
        credentials: true // Allow credentials if needed
    }
});


// Middleware
app.use(express.json());
app.use(cors({
    origin: 'https://usfarmconnect.vercel.app',  // Allow only your frontend domain
    methods: ['GET', 'POST'],
    credentials: true // Allow credentials (if you are sending cookies, authorization headers)
}));


// Attach Socket.io to the request object
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Backend is running. API is available.');
});

// MongoDB Connection
mongoose.connect('mongodb+srv://SivaUdhi:UtSCnZrWPFjcOyiR@cluster0.psxhm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Socket.io real-time connections
io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Listen on dynamic port or port 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { io };  // Export io if needed in other modules


