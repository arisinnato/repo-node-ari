const express = require('express');
const bodyParser = require('body-parser');
const productsRoutes = require('./router/product');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/api/products', productsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
