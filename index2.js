import express from "express";
import cors from "cors";
import {supabase} from './supabaseClient.js'
const app = express() // instancia del servidor
app.use(express.json()) //Casting de JSON a Objeto JS
app.use(cors()) //Permito todos los origines, todos los clientes que peticionen a este servidor y el tendra que responderles.
const PORT = 3001

//*TEST DE CONEXION
app.get("/", (req, res) =>{
//  req.body == {} JSON → obj js
    res.send(`<h1 style="text-align:center; color:blue;"> 🚀🤸🏽‍♂️Corriendo en el PUERTO ${PORT} 🤸🏽🚀</h1>`)
}) 

//*OBTENER TODOS LOS REGISTROS - GET ALL
app.get("/usuarios", async (req, res) =>{
    let {data, error } = await supabase.from('usuarios').select('*')
    if(error){
        console.log('Error al hacer GET de los usuarios', error);
        return res.status(500).send(`<h1 style="text-align:center; color:red;">Error al hacer GET de los usuarios</h1>`)
    }
    res.json(data)
}) 

//*OBTENER "EL" REGISTRO - GET/ID
app.get("/usuarios/:id", async (req, res, next) =>{
    const id = req.params.id
    let {data, error } = await supabase.from('usuarios').select('*').eq('id', id).single()
    if(error){
        console.log('Error al hacer GET del usuario', error);
        return res.status(500).send(`<h1 style="text-align:center; color:red;">Error al hacer GET del usuario</h1>`)
    }
    res.json(data)
}) 

//* ACTUALIZAR EL REGISTRO DEL ID DADO
app.put("/usuarios/:id", async (req, res, next) =>{
    try {
        const id = req.params.id
        const usuario = req.body
        //set el objeto solo con los campos validos.
        const camposActualizar = Object.fromEntries(
            Object.entries(usuario).filter(
                ([key, value]) => camposValidos.includes(key) && value !== undefined
            )
        )
        if(Object.keys(camposActualizar).length === 0)
            return res.status(400).json({error:'Al menos un campo debe ser actualizado!'})

        let {data, error } = await supabase.from('usuarios').update(camposActualizar).eq('id', id).select().single() 
        if(error || !data) throw new Error('Error al actualizar el ususario')
        res.json(data)
    } catch (error) {
        next(error)
    }
}) 


//* ELIMINAR EL REGISTRO DEL ID DADO
app.delete("/usuarios/:id", async (req, res, next) =>{
    try {
        const id = req.params.id
        let {error} = await supabase.from('usuarios').delete().eq('id', id)
        if(error) throw new Error('Error al Eliminar el ususario')
        res.status(200).send('El usuario fue eliminado exitosamente!')
    } catch (error) {
        next(error)
    }
}) 

//* INSRTAR EL REGISTRO DEL ID DADO
app.post("/usuarios", async (req, res, next) =>{
    try {
        const objUsuario = req.body
        if(!validaUsuarios(objUsuario))
        return res.status(400).json({error:'Falatn campos para realizar el post del usuario!'})

        let {data, error } = await supabase.from('usuarios').insert([{...objUsuario}]).select().single() 
        if(error) throw new Error('Error al hacer post del ususario')
        res.json(data)
    } catch (error) {
        next(error)
    }
}) 

//*MANEJO CENTRALIZADO DE LOS ERRORES
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).json({error:err.message})

})

//* LA RUTA DE ERROR 404  
app.use((req, res) =>{
//  req.body == {} JSON → obj js
    res.status(404).send(`<h1 style="text-align:center; color:red;">ERROR 404</h1>`)
}) 


app.listen(PORT, console.log('Corriendo 🚀'))