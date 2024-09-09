const express = require('express');
const sequelize = require('../db/db.config');
const productsRoutes = require('./router/product');

const app = express();
app.use(express.json());


app.use('/api/products', productsRoutes);


const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión con la base de datos establecida correctamente.');

    
    await sequelize.sync();

    app.listen(3000, () => {
      console.log('Servidor corriendo en http://localhost:3000');
    });
  } catch (error) {
    console.error('No se pudo conectar con la base de datos:', error);
  }
};

startServer();
