// operations.js
function sumar(a, b) {
    return a + b;
}

function restar(a, b) {
    return a - b;
}

function dividir(a, b) {
    if (b === 0) {
        return mostrarError("Error: No se puede dividir por cero.");
    }
    return a / b;
}

function mostrarError(mensaje) {
    console.error(mensaje);
    return null;
}

module.exports = {
    sumar,
    restar,
    dividir
};
