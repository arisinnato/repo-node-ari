const Product = require('../models/productModel');  


exports.createProduct = async (req, res) => {  
    try {  
        const product = await Product.create(req.body);  
        res.status(201).json(product);  
    } catch (error) {  
        res.status(400).json({ error: error.message });  
    }  
};  



exports.getProductById = async (req, res) => {  
    try {  
        const product = await Product.findByPk(req.params.id);  
        if (!product) {  
            return res.status(404).json({ error: 'Producto no encontrado' });  
        }  
        res.json(product);  
    } catch (error) {  
        res.status(400).json({ error: error.message });  
    }  
};  

 
exports.updateProduct = async (req, res) => {  
    try {  
        const product = await Product.findByPk(req.params.id);  
        if (!product) {  
            return res.status(404).json({ error: 'Producto no encontrado' });  
        }  
        await product.update(req.body);  
        res.json(product);  
    } catch (error) {  
        res.status(400).json({ error: error.message });  
    }  
};  


exports.deleteProduct = async (req, res) => {  
    try {  
        const product = await Product.findByPk(req.params.id);  
        if (!product) {  
            return res.status(404).json({ error: 'Producto no encontrado' });  
        }  
        await product.destroy();  
        res.status(204).send();  
    } catch (error) {  
        res.status(400).json({ error: error.message });  
    }  
};  


exports.filterProducts = async (req, res) => {  
    try {  
        const { price, quantity } = req.query;  
        const products = await Product.findAll({  
            where: {  
                ...(price && { price }),  
                ...(quantity && { quantity })  
            }  
        });  
        res.json(products);  
    } catch (error) {  
        res.status(400).json({ error: error.message });  
    }  
};