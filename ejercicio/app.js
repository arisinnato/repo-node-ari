
const operaciones = require('./operation');

const num1 = 8;
const num2 = 7;
const num3 = 9;

console.log(`La suma de ${num1} y ${num2} es:`, operaciones.sumar(num1, num3));
console.log(`La resta de ${num1} y ${num2} es:`, operaciones.restar(num2, num1));
console.log(`La división de ${num1} entre ${num2} es:`, operaciones.dividir(num1, num2));
console.log(`La división de ${num1} entre ${num3} es:`, operaciones.dividir(num1, num3));
