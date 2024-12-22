const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Basic route to test if server is running
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// View Counter Model
const ViewCounter = mongoose.model('ViewCounter', {
  page: String,
  count: Number
});

// Routes
app.post('/api/views/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const counter = await ViewCounter.findOneAndUpdate(
      { page },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
    res.json({ count: counter.count });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/views/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const counter = await ViewCounter.findOne({ page }) || { count: 0 };
    res.json({ count: counter.count });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// For Vercel, we need to export the Express app
module.exports = app;

// Only listen if we're running directly (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
