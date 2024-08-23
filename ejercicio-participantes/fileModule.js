const fs = require('fs');

function leerArchivoJson(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data); 
    } catch (err) {
        console.error('Error al leer el archivo:', err);
        return null;
    }
}

module.exports = {
    leerArchivoJson,
};
