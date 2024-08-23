const FileModule = require('./fileModule|');

const filePath = './participantes.json';


const participantes = FileModule.leerArchivoJson(filePath);

if (participantes) {
    console.log('Archivo JSON leído con éxito.');

    const participantesMasculinos = participantes.filter(participante => participante.sexo === 'masculino');
    console.log('Participantes masculinos:', participantesMasculinos);

    const countP = participantes.filter(participante => participante.nombre.toLowerCase().startsWith('p')).length;
    console.log(`Cantidad de participantes cuyo nombre comienza con "P": ${countP}`);

    const totalParticipantes = participantes.length;
    console.log(`Cantidad total de participantes: ${totalParticipantes}`);

    const participantesOrdenados = participantes.sort((a, b) => {
        if (a.sexo === b.sexo) {
            return a.edad - b.edad;
        }
        return a.sexo.localeCompare(b.sexo);
    });
    console.log('Participantes ordenados por sexo y edad:', participantesOrdenados);
} else {
    console.log('No se pudo leer el archivo JSON.');
}
