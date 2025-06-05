const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');
const emailRoutes = require('./routes/emailRoutes');
const viewsRoutes = require('./routes/viewsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Base API route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Portfolio API by sajid hussain' });
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/views', viewsRoutes);

// For Vercel
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
