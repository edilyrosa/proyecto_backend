import express from "express";
import cors from "cors";
import {supabase} from './supabaseClient.js'
const app = express() // instancia del servidor
app.use(express.json()) //Casting de JSON a Objeto JS

//* CONFIGURACION POSIBLES DE CORS
app.use(cors()) 

const PORT = 3001

class HttpError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

//*GET DE TODOS LOS USUARIOS
app.get("/usuarios", async (req, res, next) =>{
    try {
        const {data, error} = await supabase.from('usuarios').select('*')
        if(error) throw new HttpError('Error al obtener los usuarios, en el Backend!', 500)
         res.json(data) 
    } catch (error) {
        next(error)
    }
}) 

//*GET/ID DE UN SOLO USUARIO
app.get("/usuarios/:id", async (req, res, next) =>{
    try {
        const id = req.params.id
        const {data, error} = await supabase.from('usuarios').select('*').eq('id', id).single()
        if(error) throw new HttpError('Error al obtener el usuario, en el Backend!', 500)
         res.json(data) 
    } catch (error) {
        next(error)
    }
}) 
//TODO:SOLA
//POST → enviar todos los datos del registro que se esta creando, a la BDD
//PUT → enviar todos o algunos datos, cuales? solo los que se van a modificar, y necesito el id, para saber cual registro modificar
// hacer validaciones en put: los campos correctos y valores validos !== undefined
//*PUT/ID DEL USUARIO

let camposValidos = ['nombre', 'email', 'edad', 'aceptacion', 'foto', 'genero']

app.put("/usuarios/:id", async (req, res, next) =>{
    try {
        const id = req.params.id
        const usuario = req.body
        const camposActualizar = Object.fromEntries( //* convierte un array de pares clave-valor en un obj → camposActualizar es un obj
           Object.entries(usuario).filter(([key, value]) => { 
            //!FALTO return
            return camposValidos.includes(key) && value !== undefined} ) 
            //filter es un mtodo de los arrays, no de los objetos
       ) 
       if(Object.keys(camposActualizar).length === 0) throw new HttpError('No hay campos validos para actualizar', 400)
        const {error, data } = await supabase.from('usuarios').update(camposActualizar).eq('id', id).select().single()
       if(error || !data) throw new HttpError('Error al actualizar el usuario, en el Backend!', 500)
        res.json(data)
    } catch (error) {
        next(error)
    }
})


//*DELETE/ID DEL USUARIO
app.delete("/usuarios/:id", async (req, res, next) =>{
    try {
        const id = req.params.id 
        const {error} =  await supabase.from('usuarios').delete().eq('id', id)
        if(error) throw new HttpError('Error al eliminar el usuario, en el Backend!', 500)
        res.json({message: `Usuario con id ${id} eliminado correctamente`})
    } catch (error) {
        next(error)
    }
        
})

//POST → enviar TODOS!!! los datos del registro que se esta creando, a la BDD
// hacer validaciones en post: los campos correctos y valores validos !== undefined
function validarUsuario(obj){ //Funcion booleana, si retorna true, el objeto data es valido, si retorna false, es invalido
    const camposObligatorios = ['nombre', 'email', 'edad', 'aceptacion', 'foto', 'genero']
    //every() Evalua si TODOS los elementos del array cumplen con la condicion dada
    //Retornando TRUE si TODOS los elementos cumplen la condicion, o FALSE si ALGUNO no la cumple
   return camposObligatorios.every( campo => { 
     //!FALTO return
    return obj[campo] !== undefined && obj[campo] !== '' } ) //!Cada campo debe cumplir ambas condiciones a la vez: no undefined no "" 
    //! Esto es lo que se quiere para asegurar que el campo tiene un valor válido.
}

//*POST DEL USUARIO
app.post('/usuarios', async (req, res, next)=>{
    try {
        const objUsuario =  req.body //{nombre: 'Juan', email: ...'
        if(!validarUsuario( objUsuario)) throw new HttpError('Datos de usuario incompletos o invalidos', 400)
            const {error, data} = await supabase.from('usuarios').insert([{ ...objUsuario}]).select().single()
        if(error || !data) throw new HttpError('Error al crear el usuario, en el Backend!', 500)
        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
})

//*MIDDLEWARE DE MANEJO DE ERRORES
//Este intercepta cualquier error que se haya lanzado en las rutas anteriores.
//Devolver a cliente el mensaje de error y el status code HTTP correspondiente, definido por ti en el HttpError.
//si no es un HttpError o uno controlado, devolver un error 500 por defecto y un mensaje generico.
//Asi controlas mejor los errores que se envian al cliente, mediante mensajes claros y status codes adecuados.
//Evita exponer detalles internos del servidor o de la base de datos al cliente.
app.use((err, req, res, next) =>{
    console.error(err.message) // Registrar el error en la consola del servidor para depuracion
    //Capturar los errores controlados por nosotros y enviamos la respuesta.
    if(err instanceof HttpError){
        res.status(err.status).json({error: err.message}) 
    }
    //Errores no controlados, enviar un error 500 generico.
    else{
        res.status(500).json({error: 'Error interno del servidor'})
    }
})

//TODO:SOLA


app.get("/inicio", (req, res) =>{
//  req.body == {} JSON → obj js
    res.send(`<h1 style="text-align:center; color:blue;"> 🚀🤸🏽‍♂️Hola desde el /inicio 🤸🏽🚀</h1>`)
}) 

//* LA RUTA DE ERROR 404  
app.use((req, res) =>{
//  req.body == {} JSON → obj js
    res.status(404).send(`<h1 style="text-align:center; color:red;">ERROR 404</h1>`)
}) 
app.listen(PORT, console.log('Corriendo 🚀'))