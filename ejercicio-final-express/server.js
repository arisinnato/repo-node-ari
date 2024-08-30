const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const filepath = path.join(__dirname, 'estudiantes.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir el formulario HTML
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para manejar la solicitud POST de estudiantes
app.post('/estudiantes', (request, response) => {
    const { nombre, edad, curso } = request.body;

    if (!nombre || !edad || !curso) {
        return response.status(400).send('Todos los campos son obligatorios.');
    }

    fs.readFile(filepath, 'utf8', (err, data) => {
        let estudiantes = [];
        if (!err && data) {
            estudiantes = JSON.parse(data);
        }

        const nuevoEstudiante = {
            id: estudiantes.length ? estudiantes[estudiantes.length - 1].id + 1 : 1,
            nombre,
            edad,
            curso
        };
        estudiantes.push(nuevoEstudiante);

        fs.writeFile(filepath, JSON.stringify(estudiantes, null, 2), (err) => {
            if (err) return response.status(500).send('Error al guardar los datos.');
            response.redirect('/');
        });
    });
});

// Ruta para obtener todos los estudiantes
app.get('/estudiantes', (request, response) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) return response.status(500).send('Error al leer los datos.');
        const estudiantes = JSON.parse(data);
        let html = '<table><tr><th>ID</th><th>Nombre</th><th>Edad</th><th>Curso</th><th>Opciones</th></tr>';
        estudiantes.forEach(estudiante => {
            html += `<tr>
                <td>${estudiante.id}</td>
                <td>${estudiante.nombre}</td>
                <td>${estudiante.edad}</td>
                <td>${estudiante.curso}</td>
                <td class="actions">
                    <a href="/estudiante/${estudiante.id}">Modificar</a>
                    <a href="/estudiante/${estudiante.id}/eliminar">Eliminar</a>
                </td>
            </tr>`;
        });
        html += '</table>';
        response.send(html);
    });
});

// Ruta para mostrar un formulario de estudiante por ID
app.get('/estudiante/:id', (request, response) => {
    const id = parseInt(request.params.id, 10);

    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) return response.status(500).send('Error al leer los datos.');
        const estudiantes = JSON.parse(data);
        const estudiante = estudiantes.find(est => est.id === id);

        if (!estudiante) return response.status(404).send('Estudiante no encontrado.');

        response.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Modificar Estudiante</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1, h2 {
                        margin-top: 0;
                        color: #333;
                    }
                    label {
                        display: block;
                        margin-bottom: 8px;
                        font-weight: bold;
                    }
                    input, button {
                        width: calc(100% - 18px);
                        padding: 10px;
                        margin-bottom: 16px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 16px;
                    }
                    button {
                        background-color: #2c3e50;
                        color: #fff;
                        border: none;
                        cursor: pointer;
                        font-size: 18px;
                    }
                    button:hover {
                        background-color: #2c3e50;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Modificar Estudiante</h1>
                    <form action="/estudiante/${id}" method="post">
                        <label for="nombre">Nombre:</label>
                        <input type="text" id="nombre" name="nombre" value="${estudiante.nombre}" required>
                        
                        <label for="edad">Edad:</label>
                        <input type="number" id="edad" name="edad" value="${estudiante.edad}" required>
                        
                        <label for="curso">Curso:</label>
                        <input type="text" id="curso" name="curso" value="${estudiante.curso}" required>
                        
                        <button type="submit">Actualizar</button>
                    </form>
                </div>
            </body>
            </html>
        `);
    });
});

// Ruta para actualizar la información de un estudiante
app.post('/estudiante/:id', (request, response) => {
    const id = parseInt(request.params.id, 10);
    const { nombre, edad, curso } = request.body;

    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) return response.status(500).send('Error al leer los datos.');
        const estudiantes = JSON.parse(data);
        const index = estudiantes.findIndex(est => est.id === id);

        if (index === -1) return response.status(404).send('Estudiante no encontrado.');

        estudiantes[index] = { id, nombre, edad, curso };

        fs.writeFile(filepath, JSON.stringify(estudiantes, null, 2), (err) => {
            if (err) return response.status(500).send('Error al guardar los datos.');
            response.redirect('/');
        });
    });
});

// Ruta para eliminar un estudiante
app.get('/estudiante/:id/eliminar', (request, response) => {
    const id = parseInt(request.params.id, 10);

    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) return response.status(500).send('Error al leer los datos.');
        let estudiantes = JSON.parse(data);
        estudiantes = estudiantes.filter(est => est.id !== id);

        fs.writeFile(filepath, JSON.stringify(estudiantes, null, 2), (err) => {
            if (err) return response.status(500).send('Error al guardar los datos.');
            response.redirect('/');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
