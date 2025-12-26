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
connectDB().catch(err => {
  console.error('MongoDB connection failed:', err.message);
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
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
