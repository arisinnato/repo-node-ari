const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const productsFilePath = './data/products.json'

const {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  filterProducts
} = require('../controllers/Productcontroller');

//Crear un Producto
router.post('/', createProduct);

//Consultar un Producto por ID
router.get('/id', getProductById);

//Modificar un Producto
router.put('/:id', updateProduct);

//Eliminar un Producto
router.delete('/:id', deleteProduct);

//Filtrar Productos
router.get('/:id', filterProducts);

module.exports = router;
