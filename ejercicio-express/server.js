const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');


const filePath = path.join(__dirname, 'estudiantes.json');

// Función para leer el archivo de estudiantes
const leerEstudiantes = () => {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

// Función para escribir en el archivo de estudiantes
const guardarEstudiantes = (estudiantes) => {
    fs.writeFileSync(filePath, JSON.stringify(estudiantes, null, 2), 'utf8');
};

// Crear servidor
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const id = parsedUrl.pathname.split('/').pop();

    if (parsedUrl.pathname === '/' && method === 'GET') {
        const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Archivo no encontrado');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content, 'utf-8');
            }
        });
    } else if (parsedUrl.pathname === '/registrar' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const parsedData = new URLSearchParams(body);
            const nuevoEstudiante = {
                id: Date.now().toString(),
                nombre: parsedData.get('nombre'),
                edad: parseInt(parsedData.get('edad')),
                curso: parsedData.get('curso')
            };

            const estudiantes = leerEstudiantes();
            estudiantes.push(nuevoEstudiante);
            guardarEstudiantes(estudiantes);

            res.writeHead(302, { Location: '/estudiantes' });
            res.end();
        });
    } else if (parsedUrl.pathname === '/estudiantes' && method === 'GET') {
        const estudiantes = leerEstudiantes();
        let html = `
            <h1>Estudiantes Registrados</h1>
            <table border="1">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Edad</th>
                    <th>Curso</th>
                    <th>Acciones</th>
                </tr>`;
        estudiantes.forEach(estudiante => {
            html += `
                <tr>
                    <td>${estudiante.id}</td>
                    <td>${estudiante.nombre}</td>
                    <td>${estudiante.edad}</td>
                    <td>${estudiante.curso}</td>
                    <td>
                        <a href="/estudiante/${estudiante.id}">Modificar</a>
                        <button onclick="eliminarEstudiante('${estudiante.id}')">Eliminar</button>
                    </td>
                </tr>`;
        });
        html += `</table>
            <h2><a href="/">Registrar otro estudiante</a></h2>
            <script>
            function eliminarEstudiante(id) {
                fetch('/estudiante/' + id, {
                    method: 'DELETE'
                })
                .then(response => response.text())
                .then(data => {
                    alert(data);
                    location.reload();
                });
            }
            </script>`;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    } else if (parsedUrl.pathname.startsWith('/estudiante/') && method === 'GET') {
        const estudiantes = leerEstudiantes();
        const estudiante = estudiantes.find(est => est.id === id);
        if (estudiante) {
            let html = `
                <h1>Modificar Estudiante</h1>
                <form action="/estudiante/${estudiante.id}" method="post">
                    <label>Nombre:</label>
                    <input type="text" name="nombre" value="${estudiante.nombre}" required><br><br>
                    <label>Edad:</label>
                    <input type="number" name="edad" value="${estudiante.edad}" required><br><br>
                    <label>Curso:</label>
                    <input type="text" name="curso" value="${estudiante.curso}" required><br><br>
                    <button type="submit">Guardar Cambios</button>
                </form>
                <h2><a href="/estudiantes">Regresar a la lista de estudiantes</a></h2>`;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Estudiante no encontrado');
        }
    } else if (parsedUrl.pathname.startsWith('/estudiante/') && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const parsedData = new URLSearchParams(body);
            const estudiantes = leerEstudiantes();
            const estudianteIndex = estudiantes.findIndex(est => est.id === id);
            if (estudianteIndex !== -1) {
                estudiantes[estudianteIndex].nombre = parsedData.get('nombre');
                estudiantes[estudianteIndex].edad = parseInt(parsedData.get('edad'));
                estudiantes[estudianteIndex].curso = parsedData.get('curso');
                guardarEstudiantes(estudiantes);
                res.writeHead(302, { Location: '/estudiantes' });
                res.end();
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Estudiante no encontrado');
            }
        });
    } else if (parsedUrl.pathname.startsWith('/estudiante/') && method === 'DELETE') {
        const estudiantes = leerEstudiantes();
        const estudianteIndex = estudiantes.findIndex(est => est.id === id);
        if (estudianteIndex !== -1) {
            estudiantes.splice(estudianteIndex, 1);
            guardarEstudiantes(estudiantes);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Estudiante eliminado exitosamente.');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Estudiante no encontrado');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Ruta no encontrada');
    }
});


// Maneja solicitudes GET para listar estudiantes
function handleGetEstudiantes(req, res) {
    const filePath = path.join(__dirname, 'estudiantes.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error al leer el archivo de estudiantes.');
            return;
        }

        const estudiantes = JSON.parse(data);

        let html = `
        <html>
        <head>
            <title>Lista de Estudiantes</title>
        </head>
        <body>
            <h1>Estudiantes Registrados</h1>
            <table border="1">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Edad</th>
                    <th>Curso</th>
                    <th>Acciones</th>
                </tr>`;

        estudiantes.forEach(estudiante => {
            html += `
                <tr>
                    <td>${estudiante.id}</td>
                    <td>${estudiante.nombre}</td>
                    <td>${estudiante.edad}</td>
                    <td>${estudiante.curso}</td>
                    <td>
                        <a href="/estudiante/${estudiante.id}">Modificar</a>
                        <button onclick="eliminarEstudiante('${estudiante.id}')">Eliminar</button>
                    </td>
                </tr>`;
        });

        html += `
            </table>
            <script>
            function eliminarEstudiante(id) {
                if (confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
                    fetch('/estudiante/' + id, {
                        method: 'DELETE'
                    })
                    .then(response => response.text())
                    .then(data => {
                        alert(data);
                        location.reload();
                    });
                }
            }
            </script>
        </body>
        </html>`;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    });
}

// Maneja solicitudes GET para mostrar un estudiante por su ID (modificar)
function handleGetEstudianteById(req, res, id) {
    const filePath = path.join(__dirname, 'estudiantes.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error al leer el archivo de estudiantes.');
            return;
        }

        const estudiantes = JSON.parse(data);
        const estudiante = estudiantes.find(e => e.id === id);

        if (!estudiante) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Estudiante no encontrado.');
            return;
        }

        let html = `
        <html>
        <head>
            <title>Modificar Estudiante</title>
        </head>
        <body>
            <h1>Modificar Estudiante</h1>
            <form action="/estudiante/${estudiante.id}" method="post">
                <label>Nombre:</label>
                <input type="text" name="nombre" value="${estudiante.nombre}" required><br>
                <label>Edad:</label>
                <input type="number" name="edad" value="${estudiante.edad}" required><br>
                <label>Curso:</label>
                <input type="text" name="curso" value="${estudiante.curso}" required><br>
                <button type="submit">Guardar Cambios</button>
            </form>
        </body>
        </html>`;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    });
}

// Maneja solicitudes POST para modificar un estudiante por su ID
function handlePutEstudianteById(req, res, id) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const formData = new URLSearchParams(body);
        const nombre = formData.get('nombre');
        const edad = formData.get('edad');
        const curso = formData.get('curso');

        if (!nombre || !edad || !curso) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Todos los campos son obligatorios.');
            return;
        }

        const filePath = path.join(__dirname, 'estudiantes.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al leer el archivo de estudiantes.');
                return;
            }

            let estudiantes = JSON.parse(data);
            const estudianteIndex = estudiantes.findIndex(e => e.id === id);

            if (estudianteIndex === -1) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Estudiante no encontrado.');
                return;
            }

            // Actualizar los datos del estudiante
            estudiantes[estudianteIndex] = { id, nombre, edad, curso };

            // Guardar la lista actualizada
            fs.writeFile(filePath, JSON.stringify(estudiantes, null, 2), err => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error al guardar los datos actualizados.');
                    return;
                }

                res.writeHead(302, { 'Location': '/estudiantes' });
                res.end();
            });
        });
    });
}

// Maneja solicitudes DELETE para eliminar un estudiante por su ID
function handleDeleteEstudianteById(req, res, id) {
    const filePath = path.join(__dirname, 'estudiantes.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error al leer el archivo de estudiantes.');
            return;
        }

        let estudiantes = JSON.parse(data);
        const estudianteIndex = estudiantes.findIndex(e => e.id === id);

        if (estudianteIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Estudiante no encontrado.');
            return;
        }

        // Eliminar el estudiante de la lista
        estudiantes.splice(estudianteIndex, 1);

        // Guardar la lista actualizada
        fs.writeFile(filePath, JSON.stringify(estudiantes, null, 2), err => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al guardar los datos actualizados.');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Estudiante eliminado exitosamente.');
        });
    });
}

server.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
