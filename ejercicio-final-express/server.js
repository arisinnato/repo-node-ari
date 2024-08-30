const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para servir la página HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Ruta para manejar solicitudes POST y agregar estudiantes
app.post('/estudiantes', (req, res) => {
    const { nombre, edad, curso } = req.body;

    if (!nombre || !edad || !curso) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    const nuevoEstudiante = { id: Date.now(), nombre, edad, curso };

    let estudiantes = [];
    const filePath = 'estudiantes.json';

    // Leer el archivo JSON si existe
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        estudiantes = JSON.parse(data);
    }

    // Agregar el nuevo estudiante
    estudiantes.push(nuevoEstudiante);

    // Guardar la lista actualizada en el archivo JSON
    fs.writeFileSync(filePath, JSON.stringify(estudiantes, null, 2));

    res.send('Estudiante registrado correctamente');
});

// Ruta para manejar solicitudes GET y mostrar todos los estudiantes
app.get('/estudiantes', (req, res) => {
    const filePath = 'estudiantes.json';

    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        const estudiantes = JSON.parse(data);

        let respuestaHTML = '<h1>Lista de Estudiantes</h1><ul>';
        estudiantes.forEach(estudiante => {
            respuestaHTML += `<li>${estudiante.nombre}, ${estudiante.edad} años, Curso: ${estudiante.curso}</li>`;
        });
        respuestaHTML += '</ul>';

        res.send(respuestaHTML);
    } else {
        res.send('<h1>No hay estudiantes registrados</h1>');
    }
});

// Ruta para manejar solicitudes GET para modificar estudiante
app.get('/estudiante/:id', (req, res) => {
    const { id } = req.params;
    const filePath = 'estudiantes.json';

    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        const estudiantes = JSON.parse(data);
        const estudiante = estudiantes.find(est => est.id == id);

        if (estudiante) {
            res.send(`
                <h1>Modificar Estudiante</h1>
                <form action="/estudiante/${id}" method="POST">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" value="${estudiante.nombre}" required><br>
                    
                    <label for="edad">Edad:</label>
                    <input type="number" id="edad" name="edad" value="${estudiante.edad}" required><br>
                    
                    <label for="curso">Curso:</label>
                    <input type="text" id="curso" name="curso" value="${estudiante.curso}" required><br>
                    
                    <input type="submit" value="Guardar Cambios">
                </form>
            `);
        } else {
            res.status(404).send('Estudiante no encontrado');
        }
    } else {
        res.status(404).send('Archivo de estudiantes no encontrado');
    }
});

// Ruta para manejar solicitudes POST para actualizar un estudiante
app.post('/estudiante/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, edad, curso } = req.body;
    const filePath = 'estudiantes.json';

    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        let estudiantes = JSON.parse(data);

        estudiantes = estudiantes.map(est => {
            if (est.id == id) {
                return { ...est, nombre, edad, curso };
            }
            return est;
        });

        fs.writeFileSync(filePath, JSON.stringify(estudiantes, null, 2));

        res.send('Información del estudiante actualizada correctamente');
    } else {
        res.status(404).send('Archivo de estudiantes no encontrado');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
