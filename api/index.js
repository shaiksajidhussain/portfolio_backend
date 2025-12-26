// Load environment variables (required for Vercel serverless functions)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');

const app = express();

/* ---------------- CORS ---------------- */
app.use(
  cors({
    origin: [
      'https://sanjusazid.vercel.app',
      'https://sanjusazid1.vercel.app',
      'https://sanjusazid2.vercel.app',
      'http://localhost:5173'
    ],
    credentials: true
  })
);

app.options('*', cors());
app.use(express.json());

/* ---------------- DB Connection ---------------- */
// Initialize DB connection (non-blocking for serverless)
// Connection is handled in the db.js module with connection reuse
connectDB().catch(err => {
  console.error('MongoDB connection failed:', err.message);
  // Don't throw - allows function to start even if DB connection fails
  // Routes will handle DB errors individually
});

/* ---------------- Health Check ---------------- */
app.get('/', (req, res) => {
  res.json({ status: 'API running 🚀' });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

/* ---------------- Routes ---------------- */
app.use('/api/admin', require('../routes/adminRoutes'));
app.use('/api/projects', require('../routes/projectRoutes'));
app.use('/api/email', require('../routes/emailRoutes'));
app.use('/api/views', require('../routes/viewsRoutes'));
app.use('/api/carausel', require('../routes/carauselRoutes'));
app.use('/api/blog', require('../routes/blogRoutes'));
app.use('/api/resumes', require('../routes/resumeRoutes'));

/* ---------------- Global Error Handler ---------------- */
// Must be after all routes
app.use((err, req, res, next) => {
  console.error('Error:', err);
  // Don't expose internal error details in production
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
