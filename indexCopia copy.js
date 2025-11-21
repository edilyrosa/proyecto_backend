import express from "express";
import cors from "cors";
const app = express() // instancia del servidor
app.use(express.json()) //Casting de JSON a Objeto JS

//* CONFIGURACION POSIBLES DE CORS
//app.use(cors()) //*Permito todos los origines, todos los clientes que peticionen a este servidor y el tendra que responderles.
//app.use(cors({origin:'*'})) //*lo mismo del anterior, permite todos los clientes
//app.use(cors({origin:'http://127.0.0.1:3000'})) //*permite solo este cliente

const allowOrigins = [
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5501',
    'https://mitenda.com'
]
app.use(cors({
    origin:(origin, callback) =>{
        if(!origin || allowOrigins.includes())  callback(null, true)
        else callback( new Error('Origen no permitido por CORS ❌'), false)
    }
}))

const PORT = 3001
//*TEST DE CONEXION
app.get("/", (req, res) =>{
//  req.body == {} JSON → obj js
    res.send(`<h1 style="text-align:center; color:blue;"> 🚀🤸🏽‍♂️Corriendo en el PUERTO ${PORT} 🤸🏽🚀</h1>`)
}) 
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