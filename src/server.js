require('./config/loadEnv');

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`What doing? Server is running on port ${PORT}`);
});
