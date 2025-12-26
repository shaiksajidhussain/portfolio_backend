const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

console.log('Loading routes...');
try {
  const adminRoutes = require('./routes/adminRoutes');
  const projectRoutes = require('./routes/projectRoutes');
  const emailRoutes = require('./routes/emailRoutes');
  const viewsRoutes = require('./routes/viewsRoutes');
  const carauselRoutes = require('./routes/carauselRoutes');
  const blogRoutes = require('./routes/blogRoutes');
  const resumeRoutes = require('./routes/resumeRoutes');
  console.log('All routes loaded successfully');
} catch (e) {
  console.error('Error loading routes:', e.message);
}

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

// Routes
try {
  app.use('/api/admin', require('./routes/adminRoutes'));
  app.use('/api/projects', require('./routes/projectRoutes'));
  app.use('/api/email', require('./routes/emailRoutes'));
  app.use('/api/views', require('./routes/viewsRoutes'));
  app.use('/api/carausel', require('./routes/carauselRoutes'));
  app.use('/api/blog', require('./routes/blogRoutes'));
  app.use('/api/resumes', require('./routes/resumeRoutes'));
  console.log('All routes registered successfully');
} catch (e) {
  console.error('Error registering routes:', e.message);
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
