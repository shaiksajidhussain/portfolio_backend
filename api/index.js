const app = require('../server');

// Vercel Serverless Handler
module.exports = async (req, res) => {
  try {
    // Forward the request to Express
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
};
