const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowed = [
        'https://sanjusazid.vercel.app',
        'https://sanjusazid1.vercel.app',
        'https://sanjusazid2.vercel.app',
        'http://localhost:5173'
      ];

      return allowed.includes(origin)
        ? callback(null, true)
        : callback(null, false);
    },
    credentials: true
  })
);

app.options('*', cors());
app.use(express.json());

// DB - Don't block server startup on connection
connectDB().catch(err => console.error('DB connection error:', err.message));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'API running' });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Routes - Load with proper error handling
const loadRoutes = () => {
  try {
    const adminRoutes = require('./routes/adminRoutes');
    app.use('/api/admin', adminRoutes);
  } catch (err) {
    console.error('Failed to load admin routes:', err.message);
  }

  try {
    const projectRoutes = require('./routes/projectRoutes');
    app.use('/api/projects', projectRoutes);
  } catch (err) {
    console.error('Failed to load project routes:', err.message);
  }

  try {
    const emailRoutes = require('./routes/emailRoutes');
    app.use('/api/email', emailRoutes);
  } catch (err) {
    console.error('Failed to load email routes:', err.message);
  }

  try {
    const viewsRoutes = require('./routes/viewsRoutes');
    app.use('/api/views', viewsRoutes);
  } catch (err) {
    console.error('Failed to load views routes:', err.message);
  }

  try {
    const carauselRoutes = require('./routes/carauselRoutes');
    app.use('/api/carausel', carauselRoutes);
  } catch (err) {
    console.error('Failed to load carausel routes:', err.message);
  }

  try {
    const blogRoutes = require('./routes/blogRoutes');
    app.use('/api/blog', blogRoutes);
  } catch (err) {
    console.error('Failed to load blog routes:', err.message);
  }

  try {
    const resumeRoutes = require('./routes/resumeRoutes');
    app.use('/api/resumes', resumeRoutes);
  } catch (err) {
    console.error('Failed to load resume routes:', err.message);
  }
};

// Load all routes at startup
loadRoutes();

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler - must be last
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message, err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
