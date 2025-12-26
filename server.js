const express = require('express');
const cors = require('cors');

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

// Health check endpoint - ALWAYS available
app.get('/', (req, res) => {
  res.json({ status: 'API running' });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Initialize DB connection (async, non-blocking)
const initDB = async () => {
  try {
    const connectDB = require('./config/db');
    await connectDB();
    console.log('✓ Database connected successfully');
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
    // Don't exit - API should still work
  }
};

// Start DB connection in background
initDB();

// Routes - Load with individual error handling
const setupRoutes = () => {
  const routes = [
    { name: 'admin', path: '/api/admin', file: './routes/adminRoutes' },
    { name: 'projects', path: '/api/projects', file: './routes/projectRoutes' },
    { name: 'email', path: '/api/email', file: './routes/emailRoutes' },
    { name: 'views', path: '/api/views', file: './routes/viewsRoutes' },
    { name: 'carausel', path: '/api/carausel', file: './routes/carauselRoutes' },
    { name: 'blog', path: '/api/blog', file: './routes/blogRoutes' },
    { name: 'resumes', path: '/api/resumes', file: './routes/resumeRoutes' }
  ];

  routes.forEach(({ name, path, file }) => {
    try {
      const router = require(file);
      if (router && typeof router === 'object') {
        app.use(path, router);
        console.log(`✓ Loaded ${name} routes at ${path}`);
      } else {
        console.warn(`✗ ${name} route is not a valid router - got ${typeof router}`);
        throw new Error(`Invalid router type for ${name}`);
      }
    } catch (err) {
      console.error(`✗ Failed to load ${name} routes:`);
      console.error(`  File: ${file}`);
      console.error(`  Error: ${err.message}`);
      console.error(`  Stack: ${err.stack}`);
      // Fallback error route with detailed message
      app.use(path, (req, res) => {
        res.status(500).json({ 
          error: `${name} routes unavailable`,
          details: err.message
        });
      });
    }
  });
};

// Load all routes
try {
  setupRoutes();
  console.log('✓ All routes setup complete');
} catch (err) {
  console.error('Critical error in setupRoutes:', err.message);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler - MUST be last
app.use((err, req, res, next) => {
  console.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
