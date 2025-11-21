let usuario = {
    username:'rosa123',
    pass:'123456'
}
function damePass(){
    return usuario['pass']
}

let nombre = usuario['username']
console.log(usuario['pass']);

const PI = 3.14
export default PI; 
//al exportarla por defecto puedo renombarla cuando la impote. Solo puedo exportar por defecto 1 elemento por archivo

export {nombre, damePass} //es un objeto cuyos elementos No pueden ser renombrados al momento de importarlos y hazlo con {}
