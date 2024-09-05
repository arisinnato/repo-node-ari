const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const productsFilePath = './data/products.json';

const readProducts = () => {
  const data = fs.readFileSync(productsFilePath);
  return JSON.parse(data);
};

const writeProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};


exports.createProduct = (req, res) => {
  const { name, price, quantity } = req.body;

  if (!name || !price || !quantity) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  const products = readProducts();
  const newProduct = {
    id: uuidv4(),
    name,
    price,
    quantity,
  };

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
};

exports.getProductById = (req, res) => {
  const { id } = req.params;
  const products = readProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  res.json(product);
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;
  const products = readProducts();
  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  const updatedProduct = {
    ...products[productIndex],
    name: name || products[productIndex].name,
    price: price || products[productIndex].price,
    quantity: quantity || products[productIndex].quantity,
  };

  products[productIndex] = updatedProduct;
  writeProducts(products);

  res.json(updatedProduct);
};

exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  const products = readProducts();
  const newProducts = products.filter((p) => p.id !== id);

  if (products.length === newProducts.length) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  writeProducts(newProducts);

  res.status(204).send();
};

exports.filterProducts = (req, res) => {
  const { price, quantity } = req.query;
  let products = readProducts();

  if (price) {
    products = products.filter((p) => p.price == price);
  }

  if (quantity) {
    products = products.filter((p) => p.quantity == quantity);
  }

  res.json(products);
};
