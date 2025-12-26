const app = require('../server');

// For Vercel's serverless environment
// Export the app directly - @vercel/node will handle routing
module.exports = app;

// Ensure the app is ready for requests
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
