const app = require('./api/index');
const { PORT } = require('./config/secrets');

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
