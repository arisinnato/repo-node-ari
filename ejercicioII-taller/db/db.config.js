const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('ejercicioiii', 'root', 'GracoSoft#00', {  
    host: 'localhost',  
    dialect: 'mysql'  
});  

module.exports = sequelize;  