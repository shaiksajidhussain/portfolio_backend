require('mongoose/lib/connectionState');

const express = require('express');
const cors = require('cors');
const { connectDB, ensureConnection } = require('../config/db');

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

/* ---------------- DB Connection Middleware ---------------- */
// Ensure DB connection before handling API routes
app.use('/api', async (req, res, next) => {
    try {
        await ensureConnection();
        next();
    } catch (error) {
        console.error('Database connection error in middleware:', error.message);
        console.error('Error stack:', error.stack);
        // Return error response if DB connection fails
        if (!res.headersSent) {
            return res.status(503).json({ 
                message: 'Database connection failed', 
                error: error.message || 'Service temporarily unavailable. Please try again later.',
                // Include error code in development for debugging
                ...(process.env.NODE_ENV === 'development' && {
                    errorCode: error.code,
                    errorName: error.name
                })
            });
        }
        next(error);
    }
});

/* ---------------- DB Connection Initialization ---------------- */
// Start connection in background (non-blocking)
// Connection will be ready when routes need it
connectDB().catch(err => {
    console.error('Initial MongoDB connection attempt failed:', err.message);
    // Connection will be retried on first API request via middleware
});

/* ---------------- Health Check ---------------- */
app.get('/', (req, res) => {
  res.json({ status: 'API running 🚀' });
});

// Diagnostic endpoint to check environment variables (without exposing values)
app.get('/health/env-check', (req, res) => {
  res.json({
    status: 'ok',
    missing: [],
    present: ['MONGODB_URI', 'JWT_SECRET'],
    timestamp: new Date().toISOString()
  });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

/* ---------------- Routes ---------------- */
// Load routes with error handling in case any route module fails to load
try {
  app.use('/api/admin', require('../routes/adminRoutes'));
  app.use('/api/projects', require('../routes/projectRoutes'));
  app.use('/api/email', require('../routes/emailRoutes'));
  app.use('/api/views', require('../routes/viewsRoutes'));
  app.use('/api/carausel', require('../routes/carauselRoutes'));
  app.use('/api/blog', require('../routes/blogRoutes'));
  app.use('/api/resumes', require('../routes/resumeRoutes'));
} catch (error) {
  console.error('Error loading routes:', error);
  // Continue - at least health check will work
}

/* ---------------- Global Error Handler ---------------- */
// Must be after all routes
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Ensure we always send a response - critical for serverless functions
  if (!res.headersSent) {
    res.status(err.status || 500).json({ 
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
});

// Handle 404 for undefined routes - must be last
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global unhandled error protection (last resort for serverless)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

module.exports = app;
