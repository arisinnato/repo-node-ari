
const express = require('express');  
const router = express.Router();  
const productController = require('../controllers/Productcontroller');  

router.post('/post', productController.createProduct);  
router.get('/:id', productController.getProductById);  
router.put('/:id', productController.updateProduct);  
router.delete('/:id', productController.deleteProduct);  
router.get('/', productController.filterProducts);  

module.exports = router;