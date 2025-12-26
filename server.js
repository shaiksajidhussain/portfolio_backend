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

// DB - connect but don't crash if it fails
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
});

// Health
app.get('/', (req, res) => {
  res.json({ status: 'API running' });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Routes - load all routes
try {
  app.use('/api/admin', require('./routes/adminRoutes'));
} catch (e) {
  console.error('Error loading admin routes:', e.message);
  app.use('/api/admin', (req, res) => res.status(500).json({ error: 'Admin route error' }));
}

try {
  app.use('/api/projects', require('./routes/projectRoutes'));
} catch (e) {
  console.error('Error loading project routes:', e.message);
  app.use('/api/projects', (req, res) => res.status(500).json({ error: 'Project route error' }));
}

try {
  app.use('/api/email', require('./routes/emailRoutes'));
} catch (e) {
  console.error('Error loading email routes:', e.message);
  app.use('/api/email', (req, res) => res.status(500).json({ error: 'Email route error' }));
}

try {
  app.use('/api/views', require('./routes/viewsRoutes'));
} catch (e) {
  console.error('Error loading views routes:', e.message);
  app.use('/api/views', (req, res) => res.status(500).json({ error: 'Views route error' }));
}

try {
  app.use('/api/carausel', require('./routes/carauselRoutes'));
} catch (e) {
  console.error('Error loading carausel routes:', e.message);
  app.use('/api/carausel', (req, res) => res.status(500).json({ error: 'Carausel route error' }));
}

try {
  app.use('/api/blog', require('./routes/blogRoutes'));
} catch (e) {
  console.error('Error loading blog routes:', e.message);
  app.use('/api/blog', (req, res) => res.status(500).json({ error: 'Blog route error' }));
}

try {
  app.use('/api/resumes', require('./routes/resumeRoutes'));
} catch (e) {
  console.error('Error loading resume routes:', e.message);
  app.use('/api/resumes', (req, res) => res.status(500).json({ error: 'Resume route error' }));
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
