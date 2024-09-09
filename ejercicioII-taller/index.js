const express = require('express');  
const bodyParser = require('body-parser');  
const sequelize = require('./db/db.config');  
const productRoutes = require('./router/product');  

const app = express();  
app.use(bodyParser.json());  


app.use('/api/products', productRoutes);  


const startServer = async () => {  
    try {  
        await sequelize.sync(); 
        app.listen(3000, () => {  
            console.log('Servidor escuchando en http://localhost:3000');  
        });  
    } catch (error) {  
        console.error('Error al conectar a la base de datos:', error);  
    }  
};  

startServer();
