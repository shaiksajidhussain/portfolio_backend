const express = require('express');
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

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'https://sanjusazid.vercel.app',
        'https://sanjusazid1.vercel.app',
        'https://sanjusazid2.vercel.app',
        'http://localhost:5173'
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true
  })
);

app.options('*', cors());
app.use(express.json());

// Connect DB safely
(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Mongo connection failed:', err);
  }
})();

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API running' });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/views', viewsRoutes);
app.use('/api/carausel', carauselRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/resumes', resumeRoutes);

// Global error handler (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

// Export for Vercel
module.exports = app;

// Local dev only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}
