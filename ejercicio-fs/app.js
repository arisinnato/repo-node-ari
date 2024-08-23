const fs = require('fs');
const path = require('path');

// Ruta del archivo
const filePath = path.join(__dirname, 'Participantes.txt');

// Contenido a agregar
const header = "Nombre de los Participantes\n";
const participants = [
    "Lino",
    "Daniela",
    "Osmar",
    "Nathalia",
    "Siberia",
    "Ricardo",
    "David"
];

// 1. archivo con la cabecera y agg participantes
fs.writeFileSync(filePath, header, 'utf8');

// Agg nombres participantes
participants.forEach(participant => {
    fs.appendFileSync(filePath, participant + '\n', 'utf8');
});

console.log('Archivo creado y participantes agregados.');

// 2. Cambiar nombre del archivo para agg la fecha actual
const today = new Date();
const formattedDate = `${today.getDate().toString().padStart(2, '0')}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getFullYear().toString().slice(2)}`;
const newFileName = `Participantes${formattedDate}.txt`;
const newFilePath = path.join(__dirname, newFileName);

// Renombrar el archivo
fs.renameSync(filePath, newFilePath);

console.log(`Archivo renombrado a ${newFileName}`);

// 3. Crear directorio de respaldo si no existe
const backupDir = path.join(__dirname, 'respaldo');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
}

//Ruta del archivo de respaldo
const backupFilePath = path.join(backupDir, newFileName);

// Copiar archivo al directorio de respaldo
fs.copyFileSync(newFilePath, backupFilePath);

// Eliminacion archivo original
fs.unlinkSync(newFilePath);

console.log('Copia creada en ${backupFilePath} y archivo original eliminado.');
