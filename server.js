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

// Health
app.get('/', (req, res) => {
  res.json({ status: 'API running' });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Routes - Load lazily on first request to prevent startup crashes
let routesLoaded = false;

app.use((req, res, next) => {
  if (!routesLoaded) {
    try {
      const adminRoutes = require('./routes/adminRoutes');
      const projectRoutes = require('./routes/projectRoutes');
      const emailRoutes = require('./routes/emailRoutes');
      const viewsRoutes = require('./routes/viewsRoutes');
      const carauselRoutes = require('./routes/carauselRoutes');
      const blogRoutes = require('./routes/blogRoutes');
      const resumeRoutes = require('./routes/resumeRoutes');

      app.use('/api/admin', adminRoutes);
      app.use('/api/projects', projectRoutes);
      app.use('/api/email', emailRoutes);
      app.use('/api/views', viewsRoutes);
      app.use('/api/carausel', carauselRoutes);
      app.use('/api/blog', blogRoutes);
      app.use('/api/resumes', resumeRoutes);

      routesLoaded = true;
      console.log('Routes loaded successfully');
    } catch (err) {
      console.error('Error loading routes:', err.message);
      return res.status(500).json({ error: 'Failed to load routes: ' + err.message });
    }
  }
  next();
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
