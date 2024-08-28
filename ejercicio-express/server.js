const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Ruta para servir el formulario
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Ruta para manejar la solicitud POST del formulario
app.post('/estudiantes', (req, res) => {
    const { nombre, edad, curso } = req.body;

    if (!nombre || !edad || !curso) {
        return res.status(400).send('Todos los campos son obligatorios.');
    }

    let estudiantes = [];
    const path = './estudiantes.json';

    // Leer archivo JSON existente
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path);
        estudiantes = JSON.parse(data);
    }

    // Agregar nuevo estudiante
    const nuevoEstudiante = {
        id: estudiantes.length + 1,
        nombre,
        edad,
        curso
    };
    estudiantes.push(nuevoEstudiante);

    // Guardar la lista actualizada de estudiantes en el archivo JSON
    fs.writeFileSync(path, JSON.stringify(estudiantes, null, 2));

    res.send('Estudiante registrado exitosamente.');
});

// Ruta para manejar la solicitud GET y mostrar todos los estudiantes
app.get('/estudiantes', (req, res) => {
    const path = './estudiantes.json';

    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path);
        const estudiantes = JSON.parse(data);

        // Generar una tabla HTML con la lista de estudiantes
        let respuestaHTML = '<h1>Lista de Estudiantes</h1><table border="1">';
        respuestaHTML += '<tr><th>ID</th><th>Nombre</th><th>Edad</th><th>Curso</th></tr>';
        estudiantes.forEach(est => {
            respuestaHTML += `<tr><td>${est.id}</td><td>${est.nombre}</td><td>${est.edad}</td><td>${est.curso}</td></tr>`;
        });
        respuestaHTML += '</table>';

        res.send(respuestaHTML);
    } else {
        res.send('No hay estudiantes registrados.');
    }
});

// Ruta para manejar la solicitud GET para un estudiante específico
app.get('/estudiante/:id', (req, res) => {
    const path = './estudiantes.json';

    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path);
        const estudiantes = JSON.parse(data);
        const estudiante = estudiantes.find(est => est.id === parseInt(req.params.id));

        if (estudiante) {
            res.send(`
                <h1>Editar Estudiante</h1>
                <form action="/estudiante/${estudiante.id}" method="POST">
                    <input type="hidden" name="_method" value="PUT">
                    <label>Nombre: <input type="text" name="nombre" value="${estudiante.nombre}" required></label><br>
                    <label>Edad: <input type="number" name="edad" value="${estudiante.edad}" required></label><br>
                    <label>Curso: <input type="text" name="curso" value="${estudiante.curso}" required></label><br>
                    <input type="submit" value="Guardar cambios">
                </form>
            `);
        } else {
            res.status(404).send('Estudiante no encontrado.');
        }
    } else {
        res.send('No hay estudiantes registrados.');
    }
});

//Ruta para listar los estudiantes 
app.get('/', (req, res) => {
    const estudiantes = cargarEstudiantes();
    res.sendFile(path.join(__dirname, 'index.html'), { estudiantes });
});



// Ruta para manejar la solicitud PUT y actualizar un estudiante
app.put('/estudiante/:id', (req, res) => {
    const { nombre, edad, curso } = req.body;
    const path = './estudiantes.json';

    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path);
        let estudiantes = JSON.parse(data);

        const index = estudiantes.findIndex(est => est.id === parseInt(req.params.id));

        if (index !== -1) {
            estudiantes[index] = {
                id: estudiantes[index].id,
                nombre,
                edad,
                curso
            };

            fs.writeFileSync(path, JSON.stringify(estudiantes, null, 2));
            res.send('Estudiante actualizado exitosamente.');
        } else {
            res.status(404).send('Estudiante no encontrado.');
        }
    } else {
        res.send('No hay estudiantes registrados.');
    }
});

// Middleware para permitir solicitudes PUT a través de formularios
app.use((req, res, next) => {
    if (req.body._method === 'PUT') {
        req.method = 'PUT';
    }
    next();
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
