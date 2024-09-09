const Product = require('../models/productModel');


const createProduct = async (req, res) => {
  const { name, price, quantity } = req.body;
  try {
    const newProduct = await Product.create({ name, price, quantity });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto', error });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
};


const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    product.name = name || product.name;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error });
  }
};


const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    await product.destroy();
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
};


const filterProducts = async (req, res) => {
  const { price, quantity } = req.query;
  const filters = {};
  if (price) filters.price = price;
  if (quantity) filters.quantity = quantity;

  try {
    const products = await Product.findAll({ where: filters });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al filtrar productos', error });
  }
};

module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  filterProducts
};
