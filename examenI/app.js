const http = require('http');
const fs = require('fs');
const path = require('path');

// Cargar información del autor
const autorDataPath = path.join(__dirname, 'autor.json');
let autorData = {};

// Verificar si el archivo JSON existe
if (fs.existsSync(autorDataPath)) {
    autorData = JSON.parse(fs.readFileSync(autorDataPath, 'utf8'));
} else {
    // Si no existe, crear uno nuevo con la fecha actual
    autorData = {
        autor: "ari, da igual, es prueba",
        fechaInicio: new Date().toLocaleDateString('es-ES')
    };
    fs.writeFileSync(autorDataPath, JSON.stringify(autorData, null, 4));
}

// Crear el servidor
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        // Servir la página de presentación
        const htmlPath = path.join(__dirname, 'index.html');
        fs.readFile(htmlPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Error al cargar la página de inicio.');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    } else if (req.url === '/style.css') {
        // Servir el archivo CSS
        const cssPath = path.join(__dirname, 'style.css');
        fs.readFile(cssPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Error al cargar el archivo CSS.');
            } else {
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.end(data);
            }
        });
    } else if (req.url === '/autor') {
        // Servir el contenido del archivo JSON
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(autorData, null, 4));
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Página no encontrada.');
    }
});

// Configurar el puerto y iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
