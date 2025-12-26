const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');
const emailRoutes = require('./routes/emailRoutes');
const viewsRoutes = require('./routes/viewsRoutes');
const carauselRoutes = require('./routes/carauselRoutes');
const blogRoutes = require('./routes/blogRoutes');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();

// Allowed frontend URLs
const allowedOrigins = [
  'https://sanjusazid.vercel.app',
  'https://sanjusazid1.vercel.app',
  'https://sanjusazid2.vercel.app'
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

app.use(express.json());

// Connect DB
connectDB();

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Portfolio API by Sajid Hussain' });
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/views', viewsRoutes);
app.use('/api/carausel', carauselRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/resumes', resumeRoutes);

// Export for Vercel
module.exports = app;

// Local dev only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
